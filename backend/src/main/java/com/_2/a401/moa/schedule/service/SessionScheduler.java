package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.domain.ScheduleState;
import com._2.a401.moa.schedule.domain.Session;
import com._2.a401.moa.schedule.domain.SessionMember;
import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.repository.SessionMemberRepository;
import com._2.a401.moa.schedule.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com._2.a401.moa.schedule.domain.ScheduleState.ONGOING;
import static com._2.a401.moa.schedule.domain.FullSessionStage.WAITING;
import static java.time.LocalDateTime.now;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SessionScheduler {

    private final VideoConferenceManager videoConferenceManager;
    private final ScheduleRepository scheduleRepository;
    private final SessionRepository sessionRepository;
    private final SessionMemberRepository sessionMemberRepository;
    private final SessionStageService sessionStageService;

    @Scheduled(cron = "0 0,30 * * * *")
    public void createSession() {
        LocalDateTime now = now();
        LocalDateTime thirtyMinutesLater = now.plusMinutes(30);
        final List<Schedule> schedules = scheduleRepository.findBySessionTimeBetweenAndStatus(now(), thirtyMinutesLater, ScheduleState.BEFORE);

        if(schedules.isEmpty()) {
            return;
        }
        for (Schedule schedule : schedules) {
            log.info("schedule: {}", schedule.getId());
            final String sessionId = videoConferenceManager.createSession();
            final Session session = new Session(schedule.getId(), sessionId, WAITING);
            sessionStageService.startSessionTimer(schedule.getId()); // 10분뒤 다음 단계로 넘어가기 위한 타이머 설정
            sessionRepository.save(session);
            sessionMemberRepository.save(new SessionMember(schedule.getId()));
        }
        final Set<Long> scheduleIds = schedules.stream()
            .map(Schedule::getId)
            .collect(Collectors.toSet());
        scheduleRepository.bulkUpdateScheduleStatus(scheduleIds, ONGOING);
    }
}
