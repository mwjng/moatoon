package com._2.a401.moa.party.dto.response;

import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class PartySearchResponse {
    private Long partyId;
    private String bookTitle;
    private String bookCover;
    private int level;
    private int participantCount;
}
