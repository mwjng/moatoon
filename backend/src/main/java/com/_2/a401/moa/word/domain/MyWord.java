package com._2.a401.moa.word.domain;

import com._2.a401.moa.common.auditing.BaseEntity;
import com._2.a401.moa.member.domain.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "my_word")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class MyWord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int failCount;

    private boolean isDeleted;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "word_id")
    private Word word;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    public MyWord(int failCount, boolean isDeleted, Word word, Member member) {
        this.failCount = failCount;
        this.isDeleted = isDeleted;
        this.word = word;
        this.member = member;
    }

    public void countFail() {
        this.failCount++;
        this.isDeleted = false;
    }

    public void delete() {
        this.isDeleted = true;
    }
}
