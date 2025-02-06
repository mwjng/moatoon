package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.dto.request.SessionCreateRequest;
import com._2.a401.moa.schedule.dto.response.SessionCreateResponse;
import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final VideoConferenceManager videoConferenceManager;
    private final RedisTemplate<String, Object> redisTemplate;

    public SessionCreateResponse createSession(SessionCreateRequest request) {
        final String sessionId = videoConferenceManager.createSession(request.sessionProperties());
        final String token = videoConferenceManager.createConnection(sessionId, request.connectionProperties());
        return new SessionCreateResponse(token);
    }
}
