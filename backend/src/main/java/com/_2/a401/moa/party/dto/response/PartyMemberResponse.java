package com._2.a401.moa.party.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PartyMemberResponse {
    private long memberId;
    private String name;
    private String nickname;
    private long managerId;

}


