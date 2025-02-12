package com._2.a401.moa.schedule.dto.response;

import lombok.Builder;

import java.util.Map;

@Builder
public record WsReadyStatusResponse(
        String type,
        Map<Long, Boolean> readyMembers
) {
}
