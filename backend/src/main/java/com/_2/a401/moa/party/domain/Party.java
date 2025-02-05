package com._2.a401.moa.party.domain;

import com._2.a401.moa.common.auditing.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Table(name = "party")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Party extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String introduction;

    @Column(nullable = false, unique = true)
    private String pinNumber;

    @Column(nullable = false)
    private String bookCover;

    @Column(nullable = false)
    private String bookTitle;

    private int level;

    private int episodeCount;

    private int progressCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartyState status;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    private boolean isPublic;
}
