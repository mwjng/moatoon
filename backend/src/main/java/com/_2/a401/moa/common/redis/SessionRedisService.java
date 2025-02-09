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

    public void saveSession(Long scheduleId) {
        // Session Info 저장
        RedisSessionInfo sessionInfo = RedisSessionInfo.builder()
                .sessionId(1L) // TODO: sessionId도 알아야함
                .sessionStage(SessionStage.BEFORE)
                .build();
        redisService.set(RedisKeyConfig.getSessionInfoKey(scheduleId), sessionInfo);

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

        redisService.set(RedisKeyConfig.getSessionMemberKey(scheduleId), memberStatuses);
    }

    // 세션 정보 조회
    public RedisSessionInfo getSessionInfo(Long scheduleId) {
        saveSession(scheduleId);
        return redisService.get(RedisKeyConfig.getSessionInfoKey(scheduleId), new TypeReference<RedisSessionInfo>() {});
    }

    // 세션 멤버 상태 조회
    public Map<Long, RedisMemberStatus> getSessionMemberStatuses(Long scheduleId) {
        return redisService.get(RedisKeyConfig.getSessionMemberKey(scheduleId),
                new TypeReference<Map<Long, RedisMemberStatus>>() {});
    }

    // Redis에 Map 저장을 위한 메서드 (RedisTemplate 사용 예시)
    public void setSessionMemberStatuses(Long scheduleId, Map<Long, RedisMemberStatus> memberStatuses) {
        redisService.set(RedisKeyConfig.getSessionMemberKey(scheduleId), memberStatuses);
    }

    // 특정 멤버의 ready상태 업데이트
    public void changeReadyStatus(Long scheduleId, Long memberId, boolean isReady) {
        String key = RedisKeyConfig.getSessionMemberKey(scheduleId);
        Map<Long, RedisMemberStatus> currentStatuses = getSessionMemberStatuses(scheduleId);

        if (currentStatuses != null) {
            RedisMemberStatus currentStatus = currentStatuses.get(memberId);

            if (currentStatus != null) {
                // 기존 상태에서 isReady만 업데이트
                RedisMemberStatus updatedStatus = new RedisMemberStatus(
                        isReady,  // 새로운 isReady 값
                        currentStatus.isConnect()  // 기존 isConnect 값 유지
                );

                currentStatuses.put(memberId, updatedStatus);
                redisService.set(key, currentStatuses);
            }
        }
    }

    // 특정 멤버의 connect 상태 업데이트
    public void changeConnectStatus(Long scheduleId, Long memberId, boolean isConnect) {
        String key = RedisKeyConfig.getSessionMemberKey(scheduleId);
        Map<Long, RedisMemberStatus> currentStatuses = getSessionMemberStatuses(scheduleId);

        if (currentStatuses != null) {
            RedisMemberStatus currentStatus = currentStatuses.get(memberId);

            if (currentStatus != null) {
                // 연결 끊길 경우, isReady도 false로 설정
                if (!isConnect) {
                    RedisMemberStatus updatedStatus = new RedisMemberStatus(
                            false,
                            false
                    );

                    currentStatuses.put(memberId, updatedStatus);
                } else {
                    // 연결이 되면 isConnect만 업데이트
                    RedisMemberStatus updatedStatus = new RedisMemberStatus(
                            isConnect,  // 새로운 isConnect 값
                            currentStatus.isReady()  // 기존 isReady 값 유지
                    );

                    currentStatuses.put(memberId, updatedStatus);
                }
                redisService.set(key, currentStatuses);
            }
        }
    }


    // 세션 상태 업데이트
    public void updateSessionStage(Long scheduleId, SessionStage newStage) {
        String key = RedisKeyConfig.getSessionInfoKey(scheduleId);
        RedisSessionInfo currentInfo = getSessionInfo(scheduleId);

        if (currentInfo != null) {
            // RedisSessionInfo를 불변으로 만들어서 새로 생성해서 넣어준다.
            RedisSessionInfo updatedInfo = RedisSessionInfo.builder()
                    .sessionId(currentInfo.sessionId())
                    .sessionStage(newStage)
                    .build();
            redisService.set(key, updatedInfo);
        }
    }

    // 모든 연결된 멤버가 ready 상태인지 확인
    public boolean isAllMembersReady(Long scheduleId) {
        Map<Long, RedisMemberStatus> memberStatuses = getSessionMemberStatuses(scheduleId);
        if (memberStatuses == null || memberStatuses.isEmpty()) {
            return false;
        }

        return memberStatuses.values().stream()
                .filter(RedisMemberStatus::isConnect) // 연결된 멤버만 필터링
                .allMatch(RedisMemberStatus::isReady); // 연결된 멤버들이 모두 준비 완료인지 확인
    }

    // 세션 삭제
    public void deleteSession(Long scheduleId) {
        redisService.delete(RedisKeyConfig.getSessionInfoKey(scheduleId));
        redisService.delete(RedisKeyConfig.getSessionMemberKey(scheduleId));
    }
}