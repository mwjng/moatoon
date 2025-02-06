package com._2.a401.moa.schedule.manager;

import com._2.a401.moa.common.exception.MoaException;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

import static com._2.a401.moa.common.exception.ExceptionCode.*;

@Component
@RequiredArgsConstructor
public class OpenViduManager implements VideoConferenceManager {

    private final OpenVidu openVidu;

    @Override
    public String createSession(Map<String, Object> sessionProperties) {
        try {
            SessionProperties properties = SessionProperties.fromJson(sessionProperties).build();
            final Session session = Optional.ofNullable(openVidu.createSession(properties))
                .orElseThrow(() -> new MoaException(SESSION_CREATION_FAILED));
            return session.getSessionId();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new MoaException(SESSION_CREATION_FAILED);
        }
    }

    @Override
    public String createConnection(String sessionId, Map<String, Object> connectionProperties) {
        try {
            Session session = Optional.ofNullable(openVidu.getActiveSession(sessionId))
                .orElseThrow(() -> new MoaException(SESSION_NOT_FOUND));
            ConnectionProperties properties = ConnectionProperties.fromJson(connectionProperties).build();
            return session.createConnection(properties).getToken();
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            throw new MoaException(CONNECTION_CREATION_FAILED);
        }
    }
}
