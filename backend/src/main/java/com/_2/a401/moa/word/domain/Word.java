package com._2.a401.moa.word.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "word")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int level;

    @Column(nullable = false)
    private String word;

    @Column(nullable = false)
    private String meaning;
}
