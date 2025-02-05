package com._2.a401.moa.party.dto.response;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class EBookResponse {
    private Long partyId;
    private String bookTitle;
    private String bookCover;
    private List<CutResponse> cuts;
}
