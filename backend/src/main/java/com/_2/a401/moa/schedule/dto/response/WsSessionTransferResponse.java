package com._2.a401.moa.schedule.dto.response;

import com._2.a401.moa.schedule.domain.FullSessionStage;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record WsSessionTransferResponse(
        String type,
        FullSessionStage currentSessionStage,
        FullSessionStage nextSessionStage,
        LocalDateTime severTime,
        LocalDateTime sessionStartTime,
        Long sessionDuration
) {
}
