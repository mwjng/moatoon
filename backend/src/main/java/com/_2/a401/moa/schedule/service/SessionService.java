package com._2.a401.moa.schedule.service;

import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyKeyword;
import com._2.a401.moa.party.repository.PartyMemberRepository;
import com._2.a401.moa.party.repository.PartyRepository;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.domain.Session;
import com._2.a401.moa.schedule.domain.SessionMember;
import com._2.a401.moa.schedule.dto.response.SessionTokenResponse;
import com._2.a401.moa.schedule.dto.response.enterSessionResponse;
import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.repository.SessionMemberRedisRepository;
import com._2.a401.moa.schedule.repository.SessionRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

import static com._2.a401.moa.common.exception.ExceptionCode.*;
import static java.time.LocalDateTime.now;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionService {

    private static final Long MAX_SESSION_CAPACITY = 4L;

    private final VideoConferenceManager videoConferenceManager;
    private final ScheduleRepository scheduleRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final SessionRedisRepository sessionRedisRepository;
    private final SessionMemberRedisRepository sessionMemberRedisRepository;
    private final PartyRepository partyRepository;

    public synchronized SessionTokenResponse join(final Member member, final Long scheduleId) {
        validateSessionJoin(member, scheduleId);
        final Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
        if (Objects.isNull(session.getSessionId())) {
            final String sessionId = videoConferenceManager.createSession();
            session.updateSessionId(sessionId);
            sessionRedisRepository.save(session);
        }
        final String token = videoConferenceManager.createConnection(session.getSessionId());
        final SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        sessionMember.addMember(member.getId());
        sessionMemberRedisRepository.save(sessionMember);
        return new SessionTokenResponse(token);
    }

    public synchronized void leave(final Member member, final Long scheduleId) {
        final SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        sessionMember.removeMember(member.getId());
        sessionMemberRedisRepository.delete(sessionMember);
    }

    public synchronized void close(final Long scheduleId) {
        scheduleRepository.validateExistsById(scheduleId);
        scheduleRepository.completeScheduleById(scheduleId);

        final SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        sessionMemberRedisRepository.delete(sessionMember);

        final Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
        sessionRedisRepository.delete(session);
    }

    private void validateSessionJoin(final Member member, final Long scheduleId) {
        validateSessionActive(scheduleId);
        validateNotAlreadyJoined(member, scheduleId);
        validateSessionCapacity(scheduleId);
        validateJoinTime(scheduleId);
        validateMemberPermission(member, scheduleId);
    }

    private void validateSessionActive(final Long scheduleId) {
        final Schedule schedule = scheduleRepository.fetchById(scheduleId);
        if(!schedule.isActive()) {
            throw new MoaException(SCHEDULE_NOT_ACTIVE);
        }
    }

    private void validateNotAlreadyJoined(final Member member, final Long scheduleId) {
        final SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        if (sessionMember.isMemberExists(member.getId())) {
            throw new MoaException(INVALID_REQUEST);
        }
    }

    private void validateSessionCapacity(final Long scheduleId) {
        final SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        final int memberCount = sessionMember.getMemberCount();
        if(memberCount >= MAX_SESSION_CAPACITY) {
            throw new MoaException(SESSION_CAPACITY_EXCEEDED);
        }
    }

    private void validateJoinTime(final Long scheduleId) {
        final Schedule schedule = scheduleRepository.fetchById(scheduleId);
        final LocalDateTime sessionTime = schedule.getSessionTime();
        if (ChronoUnit.MINUTES.between(now(), sessionTime) > 10) {
            throw new MoaException(INVALID_REQUEST);
        }
    }

    private void validateMemberPermission(final Member member, final Long scheduleId) {
        final Schedule schedule = scheduleRepository.fetchById(scheduleId);
        final List<Long> memberIds = partyMemberRepository.findMemberIdsByPartyId(schedule.getParty().getId());
        if (!memberIds.contains(member.getId())) {
            throw new MoaException(INVALID_REQUEST);
        }
    }

    public enterSessionResponse getEnterSession(String pinNumber) {
        Long partyId = partyRepository.findPartyIdByPinNumber(pinNumber)
                .orElseThrow(() -> new MoaException(INVALID_REQUEST));

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        long scheduleId = scheduleRepository.findTodayScheduleIdByPartyId(partyId, startOfDay, endOfDay)
                .orElseThrow(() -> new MoaException(SCHEDULE_NOT_FOUND));
        return new enterSessionResponse(partyId, scheduleId);
    }
}
