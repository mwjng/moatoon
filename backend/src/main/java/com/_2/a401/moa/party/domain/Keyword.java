package com._2.a401.moa.party.domain;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "keyword")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
public class Keyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", nullable = false, unique = true)
    private String keyword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Option option;

}
