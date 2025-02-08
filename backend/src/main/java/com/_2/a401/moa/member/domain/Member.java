package com._2.a401.moa.member.domain;

import com._2.a401.moa.common.auditing.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static com._2.a401.moa.member.domain.MemberState.ACTIVE;

@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false, unique = true)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private String email;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberState status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Member manager;

    @Builder
    public Member(
            final String nickname,
            final String name,
            final String email,
            final String password,
            final String loginId,
            final String imageUrl,
            final MemberRole role,
            final MemberState status
    ) {
        this.nickname = nickname;
        this.name = name;
        this.email = email;
        this.password = password;
        this.loginId = loginId;
        this.imageUrl = imageUrl;
        this.role = role;
        this.status = ACTIVE;
    }
}
