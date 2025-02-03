package com._2.a401.moa.schedule.manager;

import java.util.Map;

public interface VideoConferenceManager {

    String createSession(Map<String, Object> params);

    String createConnection(String sessionId, Map<String, Object> params);
}
