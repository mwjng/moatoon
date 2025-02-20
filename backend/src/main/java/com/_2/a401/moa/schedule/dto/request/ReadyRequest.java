package com._2.a401.moa.schedule.dto.request;

public record ReadyRequest(
        Long scheduleId,
        String accessToken, // STOMP 헤더에 넣을 수도 있음
        Boolean status
) {
}
