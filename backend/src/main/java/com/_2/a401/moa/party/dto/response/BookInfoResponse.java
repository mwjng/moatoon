package com._2.a401.moa.party.dto.response;

import com._2.a401.moa.party.domain.PartyState;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class BookResponse {
    private Long id;
    private String bookCover;
    private String bookTitle;
    private PartyState status;
    private LocalDate startDate;
    private LocalDate endDate;
}
