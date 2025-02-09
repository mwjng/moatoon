package com._2.a401.moa.common.redis;

import com._2.a401.moa.common.redis.dto.RedisMemberStatus;
import com._2.a401.moa.common.redis.dto.RedisSessionInfo;
import com._2.a401.moa.common.redis.dto.SessionStage;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionRedisService {
    private final RedisService redisService;

    public void saveSession(Long sessionId) {
        // Session Info 저장
        RedisSessionInfo sessionInfo = RedisSessionInfo.builder()
                .sessionId(sessionId)
                .sessionStage(SessionStage.BEFORE)
                .build();
        redisService.set(RedisKeyConfig.getSessionInfoKey(sessionId), sessionInfo);

        // Session Member Status 저장
        Map<Long, RedisMemberStatus> memberStatuses = new HashMap<>();
        // TODO: 실제 세션 참가자 조회 로직 필요
        Long[] memberIds = {1L, 2L, 3L, 4L};  // 더미 데이터

        for (Long memberId : memberIds) {
            RedisMemberStatus status = RedisMemberStatus.builder()
                    .isConnect(false)
                    .isReady(false)
                    .build();
            memberStatuses.put(memberId, status);
        }

        redisService.set(RedisKeyConfig.getSessionMemberKey(sessionId), memberStatuses);
    }

    // 세션 정보 조회
    public RedisSessionInfo getSessionInfo(Long sessionId) {
        saveSession(sessionId);
        return redisService.get(RedisKeyConfig.getSessionInfoKey(sessionId), new TypeReference<RedisSessionInfo>() {});
    }

    // 세션 멤버 상태 조회
    public Map<Long, RedisMemberStatus> getSessionMemberStatuses(Long sessionId) {
        return redisService.get(RedisKeyConfig.getSessionMemberKey(sessionId),
                new TypeReference<Map<Long, RedisMemberStatus>>() {});
    }

    // Redis에 Map 저장을 위한 메서드 (RedisTemplate 사용 예시)
    public void setSessionMemberStatuses(Long sessionId, Map<Long, RedisMemberStatus> memberStatuses) {
        redisService.set(RedisKeyConfig.getSessionMemberKey(sessionId), memberStatuses);
    }

    // 특정 멤버 상태 업데이트
    public void updateMemberStatus(Long sessionId, Long memberId, RedisMemberStatus newStatus) {
        String key = RedisKeyConfig.getSessionMemberKey(sessionId);
        Map<Long, RedisMemberStatus> currentStatuses = getSessionMemberStatuses(sessionId);

        if (currentStatuses != null) {
            currentStatuses.put(memberId, newStatus);
            redisService.set(key, currentStatuses);
        }
    }

    // 세션 상태 업데이트
    public void updateSessionStage(Long sessionId, SessionStage newStage) {
        String key = RedisKeyConfig.getSessionInfoKey(sessionId);
        RedisSessionInfo currentInfo = getSessionInfo(sessionId);

        if (currentInfo != null) {
            RedisSessionInfo updatedInfo = RedisSessionInfo.builder()
                    .sessionId(currentInfo.sessionId())
                    .sessionStage(newStage)
                    .build();
            redisService.set(key, updatedInfo);
        }
    }

    // 모든 멤버가 ready 상태인지 확인
    public boolean isAllMembersReady(Long sessionId) {
        Map<Long, RedisMemberStatus> memberStatuses = getSessionMemberStatuses(sessionId);
        if (memberStatuses == null || memberStatuses.isEmpty()) {
            return false;
        }

        return memberStatuses.values().stream()
                .allMatch(RedisMemberStatus::isReady);
    }

    // 세션 삭제
    public void deleteSession(Long sessionId) {
        redisService.delete(RedisKeyConfig.getSessionInfoKey(sessionId));
        redisService.delete(RedisKeyConfig.getSessionMemberKey(sessionId));
    }
}