package com._2.a401.moa.schedule.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ScheduleInfoResponse {
    private Long partyId;
    private int episodeNumber;
}
