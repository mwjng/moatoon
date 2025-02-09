package com._2.a401.moa.schedule.dto.response;

import com._2.a401.moa.common.redis.dto.SessionStage;
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
        SessionStage sessionStage

) {
    public static TodaySchedule of(ScheduleInfo schedule, SessionStage sessionStage) {
        return TodaySchedule.builder()
                .scheduleId(schedule.scheduleId())
                .bookTitle(schedule.bookTitle())
                .bookCover(schedule.bookCover())
                .sessionTime(schedule.getSessionTimeAsLocalDateTime())
                .episodeNumber(schedule.episodeNumber())
                .sessionStage(sessionStage)
                .build();
    }
}
