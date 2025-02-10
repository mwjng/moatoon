package com._2.a401.moa.schedule.domain;

import com._2.a401.moa.party.domain.Party;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import static com._2.a401.moa.schedule.domain.ScheduleState.ONGOING;

@Table(name = "schedule")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
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
    private ScheduleState status = ScheduleState.BEFORE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "party_id")
    private Party party;

    public boolean isActive() {
        return ONGOING.equals(status);
    }
}
