package com._2.a401.moa.schedule.service;

import com._2.a401.moa.cut.domain.Cut;
import com._2.a401.moa.cut.repository.CutRepository;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyMember;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.repository.PartyMemberRepository;
import com._2.a401.moa.party.repository.PartyRepository;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.domain.ScheduleState;
import com._2.a401.moa.schedule.domain.Session;
import com._2.a401.moa.schedule.domain.SessionMember;
import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.repository.SessionMemberRepository;
import com._2.a401.moa.schedule.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com._2.a401.moa.schedule.domain.ScheduleState.ONGOING;
import static com._2.a401.moa.schedule.domain.SessionStage.WAITING;
import static java.time.LocalDateTime.now;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionScheduler {

    private final VideoConferenceManager videoConferenceManager;
    private final ScheduleRepository scheduleRepository;
    private final SessionRepository sessionRepository;
    private final SessionMemberRepository sessionMemberRepository;
    private final PartyRepository partyRepository;
    private final CutRepository cutRepository;
    private final PartyMemberRepository partyMemberRepository;

    @Scheduled(cron = "0 0,30 * * * *")
    public void createSession() {
        LocalDateTime now = now();
        LocalDateTime thirtyMinutesLater = now.plusMinutes(30);
        final List<Schedule> schedules = scheduleRepository.findBySessionTimeBetweenAndStatus(now(), thirtyMinutesLater, ScheduleState.BEFORE);
        final List<Party> upcomingParties = partyRepository.findPartiesStartingSoon(now, thirtyMinutesLater);

        if(!upcomingParties.isEmpty()) {
            divideCut(upcomingParties);
        }

        if(schedules.isEmpty()) {
            return;
        }
        for (Schedule schedule : schedules) {
            final String sessionId = videoConferenceManager.createSession();
            final Session session = new Session(schedule.getId(), sessionId, WAITING);
            sessionRepository.save(session);
            sessionMemberRepository.save(new SessionMember(schedule.getId()));
        }
        final Set<Long> scheduleIds = schedules.stream()
            .map(Schedule::getId)
            .collect(Collectors.toSet());
        scheduleRepository.bulkUpdateScheduleStatus(scheduleIds, ONGOING);
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
