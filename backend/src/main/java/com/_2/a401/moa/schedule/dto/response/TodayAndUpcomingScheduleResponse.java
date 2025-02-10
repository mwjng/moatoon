package com._2.a401.moa.schedule.dto.response;

import lombok.Builder;

import java.util.List;

@Builder
public record TodayAndUpcomingScheduleResponse(
        TodaySchedule todaySchedule,
        List<UpcomingSchedule> upcomingSchedules
) {
    public static TodayAndUpcomingScheduleResponse of(TodaySchedule todaySchedule,
                                                      List<UpcomingSchedule> upcomingSchedules) {
        return TodayAndUpcomingScheduleResponse.builder()
                .todaySchedule(todaySchedule)
                .upcomingSchedules(upcomingSchedules != null ? upcomingSchedules : List.of())
                .build();
    }
}
