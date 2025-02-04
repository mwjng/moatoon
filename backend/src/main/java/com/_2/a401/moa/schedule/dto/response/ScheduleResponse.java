package com._2.a401.moa.schedule.dto.response;

public record ScheduleResponse(
        Long scheduleId,
        String bookTitle,
        String sessionTime
) {
}