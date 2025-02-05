package com._2.a401.moa.schedule.dto.response;

import java.util.List;

public record MonthlyChildrenSchedulesResponse(
    int month,
    List<MemberSchedulesResponse> childrenSchedules
) {
}
