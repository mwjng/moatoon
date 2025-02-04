package com._2.a401.moa.schedule.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record ScheduleResponse(
        int scheduleId,
        String bookTitle,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime sessionTime
) {
}
