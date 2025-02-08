package com._2.a401.moa.schedule.dto.response;

import java.util.List;

public record MemberCalendarSchedulesResponse(
        Long memberId,
        String name,
        List<CalendarScheduleResponse> schedules
) {
}
