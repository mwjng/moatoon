package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final VideoConferenceManager videoConferenceManager;

    public String initializeSession(Map<String, Object> params) {
        return videoConferenceManager.createSession(params);
    }

    public String createConnection(String sessionId, Map<String, Object> params) {
        return videoConferenceManager.createConnection(sessionId, params);
    }
}
