package com._2.a401.moa.schedule.dto.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class enterSessionResponse {
    private final long partyId;
    private final long scheduleId;
}
