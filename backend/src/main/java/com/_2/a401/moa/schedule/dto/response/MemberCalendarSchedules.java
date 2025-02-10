package com._2.a401.moa.schedule.dto.response;

import java.util.List;

public record MemberCalendarSchedules(
        Long memberId,
        String name,
        List<CalendarSchedule> schedules
) {
}
