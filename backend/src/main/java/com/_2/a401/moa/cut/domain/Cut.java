package com._2.a401.moa.cut.domain;

import com._2.a401.moa.common.auditing.BaseEntity;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.word.domain.Word;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "cut")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Cut extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @Column(nullable = false)
    private String content;

    private int cutOrder;

    private int randomOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CutState status;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "word_id")
    private Word word;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "party_id")
    private Party party;
}
