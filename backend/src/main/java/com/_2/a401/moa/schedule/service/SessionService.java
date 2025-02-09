package com._2.a401.moa.schedule.service;

import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.party.repository.PartyMemberRepository;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.dto.response.SessionTokenResponse;
import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com._2.a401.moa.common.exception.ExceptionCode.*;
import static java.lang.Boolean.*;
import static java.time.LocalDateTime.now;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionService {

    private static final Long MAX_SESSION_CAPACITY = 4L;
    private static final String SESSION_KEY_PREFIX = "session:";
    private static final String SESSION_MEMBER_KEY_PREFIX = "member:";
    private static final Duration SESSION_MEMBER_TTL = Duration.ofHours(1L);

    private final VideoConferenceManager videoConferenceManager;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ScheduleRepository scheduleRepository;
    private final PartyMemberRepository partyMemberRepository;

    public SessionTokenResponse join(final Member member, final Long scheduleId) {
        validateSessionJoin(member, scheduleId);
        final ValueOperations<String, Object> opsForValue = redisTemplate.opsForValue();
        final String sessionKey = getSessionKey(scheduleId);
        final String sessionId = Objects.requireNonNull(opsForValue.get(sessionKey)).toString();
        final String token = videoConferenceManager.createConnection(sessionId);

        final SetOperations<String, Object> opsForSet = redisTemplate.opsForSet();
        final String sessionMemberKey = getSessionMemberKey(scheduleId);
        opsForSet.add(sessionMemberKey, member.getId());
        redisTemplate.expire(sessionMemberKey, SESSION_MEMBER_TTL);
        return new SessionTokenResponse(token);
    }

    public void leave(final Member member, final Long scheduleId) {
        scheduleRepository.validateExistsById(scheduleId);
        final SetOperations<String, Object> opsForSet = redisTemplate.opsForSet();
        opsForSet.remove(getSessionMemberKey(scheduleId), member.getId());
    }

    public void close(final Long scheduleId) {
        scheduleRepository.validateExistsById(scheduleId);
        scheduleRepository.completeScheduleById(scheduleId);
        redisTemplate.delete(getSessionKey(scheduleId));
        redisTemplate.delete(getSessionMemberKey(scheduleId));
    }

    private void validateSessionJoin(final Member member, final Long scheduleId) {
        validateSessionExists(scheduleId);
        validateSessionActive(scheduleId);
        validateNotAlreadyJoined(member, scheduleId);
        validateSessionCapacity(scheduleId);
        validateJoinTime(scheduleId);
        validateMemberPermission(member, scheduleId);
    }

    private void validateSessionExists(final Long scheduleId) {
        final ValueOperations<String, Object> opsForValue = redisTemplate.opsForValue();
        Optional.ofNullable(opsForValue.get(getSessionKey(scheduleId)))
            .orElseThrow(() -> new MoaException(SESSION_NOT_FOUND));
    }

    private void validateSessionActive(final Long scheduleId) {
        final Schedule schedule = scheduleRepository.fetchById(scheduleId);
        if(!schedule.isActive()) {
            throw new MoaException(SCHEDULE_NOT_ACTIVE);
        }
    }

    private synchronized void validateNotAlreadyJoined(final Member member, final Long scheduleId) {
        final SetOperations<String, Object> opsForSet = redisTemplate.opsForSet();
        final String key = getSessionMemberKey(scheduleId);
        if (TRUE.equals(opsForSet.isMember(key, member.getId()))) {
            throw new MoaException(INVALID_REQUEST);
        }
    }

    private synchronized void validateSessionCapacity(final Long scheduleId) {
        final SetOperations<String, Object> opsForSet = redisTemplate.opsForSet();
        final String key = getSessionMemberKey(scheduleId);
        final Long memberCount = opsForSet.size(key);
        if(!Objects.isNull(memberCount) && memberCount >= MAX_SESSION_CAPACITY) {
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

    private String getSessionKey(final Long scheduleId) {
        return SESSION_KEY_PREFIX + scheduleId;
    }

    private String getSessionMemberKey(final Long scheduleId) {
        return SESSION_MEMBER_KEY_PREFIX + scheduleId;
    }
}
