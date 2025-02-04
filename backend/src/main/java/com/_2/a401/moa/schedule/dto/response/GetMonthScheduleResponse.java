package com._2.a401.moa.schedule.dto.response;

import java.util.List;

public record GetMonthScheduleResponse(
    int month,
    List<MemberScheduleResponse> memberScheduleList
) {
}
