package com._2.a401.moa.schedule.dto.response;

import com._2.a401.moa.schedule.dto.ScheduleInfo;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UpcomingSchedule(
        Long scheduleId,
        String bookTitle,
        String bookCover,
        LocalDateTime sessionTime
) {
    public static UpcomingSchedule from(ScheduleInfo schedule) {
        return UpcomingSchedule.builder()
                .scheduleId(schedule.scheduleId())
                .bookTitle(schedule.bookTitle())
                .bookCover(schedule.bookCover())
                .sessionTime(schedule.getSessionTimeAsLocalDateTime())
                .build();
    }
}
