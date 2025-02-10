package com._2.a401.moa.schedule.dto.response;

import com._2.a401.moa.schedule.dto.ScheduleInfo;
import lombok.Builder;

@Builder
public record UpcomingSchedule(
        Long scheduleId,
        String bookTitle,
        String bookCover
) {
    public static UpcomingSchedule from(ScheduleInfo schedule) {
        return UpcomingSchedule.builder()
                .scheduleId(schedule.scheduleId())
                .bookTitle(schedule.bookTitle())
                .bookCover(schedule.bookCover())
                .build();
    }
}
