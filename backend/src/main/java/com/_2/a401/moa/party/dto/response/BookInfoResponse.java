package com._2.a401.moa.party.dto.response;

import com._2.a401.moa.party.domain.PartyState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@ToString
public class BookInfoResponse {
    private Long id;
    private String bookCover;
    private String bookTitle;
    private PartyState status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
