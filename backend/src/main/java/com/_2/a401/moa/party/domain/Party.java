package com._2.a401.moa.party.domain;

import com._2.a401.moa.common.auditing.BaseEntity;
import com._2.a401.moa.schedule.domain.Schedule;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Table(name = "party")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
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

    private int progressCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartyState status = PartyState.BEFORE;

    @Column(nullable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private boolean isPublic;

    @OneToMany(mappedBy = "party", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "party", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PartyKeyword> partyKeywords;

    @OneToMany(mappedBy = "party", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PartyMember> partyMembers;
}
