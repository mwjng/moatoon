package com._2.a401.moa.schedule.service;

import com._2.a401.moa.cut.domain.Cut;
import com._2.a401.moa.cut.repository.CutRepository;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyMember;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.repository.PartyMemberRepository;
import com._2.a401.moa.party.repository.PartyRepository;
import com._2.a401.moa.schedule.domain.*;
import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.repository.SessionMemberRedisRepository;
import com._2.a401.moa.schedule.repository.SessionRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
    private final PartyRepository partyRepository;
    private final CutRepository cutRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final SessionRedisRepository sessionRedisRepository;
    private final SessionMemberRedisRepository sessionMemberRedisRepository;
    private final SessionStageService sessionStageService;

    @Scheduled(cron = "0 */5 * * * *")
    public void createSession() {
        log.info("SessionScheduler.createSession");
        LocalDateTime now = now();
        log.info("현재 시간: {}", now);
        LocalDateTime thirtyMinutesLater = now.plusMinutes(30);
        log.info("현재 시간 + 30분: {}", thirtyMinutesLater);
        final List<Schedule> schedules = scheduleRepository.findBySessionTimeBetweenAndStatus(now(), thirtyMinutesLater, ScheduleState.BEFORE);
        final List<Party> upcomingParties = partyRepository.findPartiesStartingSoon(now, thirtyMinutesLater);

        if(!upcomingParties.isEmpty()) {
            log.info("upComingParties 있음");
            divideCut(upcomingParties);
        }

        if(schedules.isEmpty()) {
            log.info("시작할 일정 없음");
            return;
        }
        for (Schedule schedule : schedules) {
            log.info("Redis에 저장할 일정: {}", schedule.getId());

            // Redis에 저장
            final Session session = new Session(
                    schedule.getId(),
                    null,
                    WAITING,
                    schedule.getSessionTime().minusSeconds(WAITING.getDuration()) // redis에 저장하는 startTime은 각 단게의 시작시간이므로 여기서도 대기방의 시작시간을 넣어줘야한다.
            );

            log.info("Redis에 저장된 일정: {}", session.toString());
            sessionRedisRepository.save(session);
            sessionMemberRedisRepository.save(new SessionMember(schedule.getId()));

            // 세션 시작 후, 10분뒤 다음 단계로 넘어가기 위한 타이머 설정
            log.info("일정 {}의 타이머 설정", schedule.getId());
            sessionStageService.setWaitingRoomTimer(schedule.getId());
        }
        final Set<Long> scheduleIds = schedules.stream()
            .map(Schedule::getId)
            .collect(Collectors.toSet());
        scheduleRepository.bulkUpdateScheduleStatus(scheduleIds, ONGOING);
    }

    @Scheduled(cron = "0 25,55 * * * *")
    public void garbageCollectSession() {
        log.info("SessionScheduler.garbageCollectSession");
        LocalDateTime now = now();
        log.info("현재 시간: {}", now);
        LocalDateTime thirtyMinutesBefore = now.minusMinutes(30);
        log.info("현재 시간 - 30분: {}", thirtyMinutesBefore);

        final List<Schedule> garbageSessions = scheduleRepository.findBySessionTimeLessThanEqualAndStatusNot(thirtyMinutesBefore, ScheduleState.DONE);
        for (Schedule schedule : garbageSessions) {
            log.info("일정 종료: {}", schedule.getId());

            schedule.endSchedule();
        }
    }

    public void divideCut(List<Party> upcomingParties) {

        for (Party party : upcomingParties) {
            party.setStatus(PartyState.ONGOING);
            partyRepository.save(party);

            List<Cut> cuts = cutRepository.findByPartyOrderByRandomOrderAsc(party);
            List<PartyMember> partyMembers = partyMemberRepository.findByPartyOrderByModifiedAtAsc(party);

            Map<Integer, List<Cut>> groupedCuts = cuts.stream()
                    .collect(Collectors.groupingBy(Cut::getRandomOrder));

            for (int i = 0; i < Math.min(partyMembers.size(), 4); i++) {
                final PartyMember member = partyMembers.get(i);
                final int assignedRandomOrder = i + 1;

                if (groupedCuts.containsKey(assignedRandomOrder)) {
                    for (Cut cut : groupedCuts.get(assignedRandomOrder)) {
                        cut.setMember(member.getMember());
                    }
                }
            }
            cutRepository.saveAll(cuts);
        }
    }

}
