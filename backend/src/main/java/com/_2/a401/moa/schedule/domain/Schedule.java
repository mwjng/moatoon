package com._2.a401.moa.schedule.domain;

import com._2.a401.moa.party.domain.Party;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "schedule")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Day dayWeek;

    @Column(nullable = false)
    private LocalDateTime sessionTime;

    private int episodeNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleState status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "party_id")
    private Party party;
}
