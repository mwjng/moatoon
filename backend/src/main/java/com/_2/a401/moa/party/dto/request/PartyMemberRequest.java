package com._2.a401.moa.party.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PartyMemberRequest {
    private Long managerId;
    private List<Long> childIds;
}
