package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com._2.a401.moa.schedule.domain.ScheduleState.*;
import static java.time.LocalDateTime.now;

@Service
@RequiredArgsConstructor
public class SessionScheduler {

    private static final String SESSION_KEY_PREFIX = "session:";
    private static final Duration SESSION_TTL = Duration.ofMinutes(90L);

    private final VideoConferenceManager videoConferenceManager;
    private final ScheduleRepository scheduleRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Scheduled(cron = "0 0,30 * * * *")
    public void createSession() {
        LocalDateTime now = now();
        LocalDateTime thirtyMinutesLater = now.plusMinutes(30);
        final List<Schedule> schedules = scheduleRepository.findBySessionTimeBetweenAndStatus(now(), thirtyMinutesLater, BEFORE);

        for (Schedule schedule : schedules) {
            final String sessionId = videoConferenceManager.createSession();
            redisTemplate.opsForValue().set(SESSION_KEY_PREFIX + schedule.getId(), sessionId, SESSION_TTL);
        }
        final Set<Long> scheduleIds = schedules.stream()
            .map(Schedule::getId)
            .collect(Collectors.toSet());
        scheduleRepository.bulkUpdateScheduleStatus(scheduleIds, ONGOING);
    }
}
