package com._2.a401.moa.common.redis;

import com._2.a401.moa.common.redis.dto.SessionMemberStatus;
import com._2.a401.moa.common.redis.dto.SessionRedisInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionRedisService {
    private final RedisService redisService;
    private static final String SESSION_KEY_PREFIX = "session:";

    public void saveSession(Long sessionId) {
        // TODO: 세션 30분 전에 redis에 올려야하는 데이터

        Map<Long, SessionMemberStatus> dummyMemberStatuses = new HashMap<>();
        // TODO: 세션에 참가하는 멤버들 찾아서 올리기 / 일단 더미데이터 사용함
        SessionMemberStatus[] dummyStatuses = {
                new SessionMemberStatus(false, false),  // 접속X, 준비X
                new SessionMemberStatus(false, false),
                new SessionMemberStatus(false, false),
                new SessionMemberStatus(false, false)
        };
        dummyMemberStatuses.put(1L, dummyStatuses[0]);
        dummyMemberStatuses.put(2L, dummyStatuses[1]);
        dummyMemberStatuses.put(3L, dummyStatuses[2]);
        dummyMemberStatuses.put(4L, dummyStatuses[3]);

        // TODO: 세션토큰도 넣어줘야함, 지금은 더미데이터
        SessionRedisInfo sessionInfo = new SessionRedisInfo("세션 토큰", "대기 중", dummyMemberStatuses);
        redisService.set(getSessionKey(sessionId), sessionInfo);
    }

    public String getSessionStage(Long sessionId) {
        SessionRedisInfo sessionInfo = getSessionInfo(sessionId);
        return sessionInfo != null ? sessionInfo.sessionStage() : "NOT IN REDIS";
    }

    private SessionRedisInfo getSessionInfo(Long sessionId) {
        return redisService.get(getSessionKey(sessionId), SessionRedisInfo.class);
    }

    private String getSessionKey(Long sessionId) {
        return SESSION_KEY_PREFIX + sessionId;
    }
}