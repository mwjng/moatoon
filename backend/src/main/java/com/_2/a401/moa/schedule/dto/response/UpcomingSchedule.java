package com._2.a401.moa.schedule.dto.response;

import com._2.a401.moa.schedule.dto.ScheduleInfo;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UpcomingSchedule(
        Long partyId,
        Long scheduleId,
        String bookTitle,
        String bookCover,
        LocalDateTime sessionTime
) {
    public static UpcomingSchedule from(ScheduleInfo schedule, Long partyId) {
        return UpcomingSchedule.builder()
                .partyId(partyId)
                .scheduleId(schedule.scheduleId())
                .bookTitle(schedule.bookTitle())
                .bookCover(schedule.bookCover())
                .sessionTime(schedule.getSessionTimeAsLocalDateTime())
                .build();
    }
}
