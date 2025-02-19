package com._2.a401.moa.party.dto.response;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class EBookResponse {
    private Long partyId;
    private String introduction;
    private String bookTitle;
    private String bookCover;
    private int episodeCount;
    private int progressCount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<CutResponse> cuts;
}
