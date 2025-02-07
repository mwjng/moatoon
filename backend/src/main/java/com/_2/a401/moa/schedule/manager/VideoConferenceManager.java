package com._2.a401.moa.schedule.manager;

import java.util.Map;

public interface VideoConferenceManager {

    String createSession();

    String createSession(Map<String, Object> sessionProperties);

    String createConnection(String sessionId);

    String createConnection(String sessionId, Map<String, Object> connectionProperties);
}
