package com._2.a401.moa.schedule.dto.response;

import java.util.List;

public record MemberScheduleResponse(
        int memberId,
        String name,
        List<ScheduleResponse> scheduleList
) {
}
