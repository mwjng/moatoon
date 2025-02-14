package com._2.a401.moa.schedule.dto.response;

import com._2.a401.moa.schedule.domain.Session;

import java.time.LocalDateTime;

public record CurrentSessionStageResponse(
        String currentSessionStage,
        LocalDateTime serverTime,
        LocalDateTime sessionStageStartTime,
        Long sessionDuration
) {
    public static CurrentSessionStageResponse from(Session session) {
        return new CurrentSessionStageResponse(
                session.getSessionStage().toString(),
                LocalDateTime.now(),
                session.getStartTime(),
                session.getSessionStage().getDuration()
        );
    }
}
