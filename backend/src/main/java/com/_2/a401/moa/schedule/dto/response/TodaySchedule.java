package com._2.a401.moa.schedule.dto.response;

import com._2.a401.moa.schedule.domain.FullSessionStage;
import com._2.a401.moa.schedule.dto.ScheduleInfo;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TodaySchedule(
        Long scheduleId,
        String bookTitle,
        String bookCover,
        Integer episodeNumber,
        LocalDateTime sessionTime,
        FullSessionStage sessionStage,
        String pinNumber

) {
    public static TodaySchedule of(ScheduleInfo schedule, FullSessionStage sessionStage) {
        return TodaySchedule.builder()
                .scheduleId(schedule.scheduleId())
                .bookTitle(schedule.bookTitle())
                .bookCover(schedule.bookCover())
                .sessionTime(schedule.getSessionTimeAsLocalDateTime())
                .episodeNumber(schedule.episodeNumber())
                .sessionStage(sessionStage)
                .pinNumber(schedule.pinNumber())
                .build();
    }
}
