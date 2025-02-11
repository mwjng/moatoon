package com._2.a401.moa.party.domain;

import com._2.a401.moa.common.auditing.BaseEntity;
import com._2.a401.moa.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "party_member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
public class PartyMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "party_id")
    private Party party;
}
