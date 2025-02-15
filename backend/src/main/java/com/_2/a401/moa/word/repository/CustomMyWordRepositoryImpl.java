package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.domain.QMyWord;
import com._2.a401.moa.word.domain.QWord;
import com._2.a401.moa.word.domain.QWordExample;
import com._2.a401.moa.word.dto.MyWordExample;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomMyWordRepositoryImpl implements CustomMyWordRepository{
    private final JPAQueryFactory queryFactory;

    @Override
    public List<MyWordExample> findWithWordIdAndPage(Long memberId, int page, String keyword) {
        QWord word = QWord.word1;
        QMyWord myWord = QMyWord.myWord;
        QWordExample wordExample = QWordExample.wordExample;

        // 동적 쿼리를 위한 조건 빌더
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(myWord.member.id.eq(memberId)); // memberId 조건 추가
        builder.and(myWord.isDeleted.eq(false)); // isDeleted 조건 추가

        // keyword가 존재하면 LIKE 조건 추가
        if (keyword != null && !keyword.isEmpty()) {
            builder.and(word.word.likeIgnoreCase("%" + keyword + "%")); // keyword 조건 추가
        }

        return queryFactory
                .select(Projections.constructor(MyWordExample.class,
                        wordExample.id,
                        word.word,
                        word.meaning,
                        myWord.failCount,
                        wordExample.example))
                .from(myWord)
                .join(word).on(myWord.word.id.eq(word.id))
                .join(wordExample).on(wordExample.word.id.eq(word.id))
                .where(builder)
                .offset(page)
                .limit(4)
                .fetch();
    }

    @Override
    public Long countAll(Long memberId, String keyword) {
        QWord word = QWord.word1;
        QMyWord myWord = QMyWord.myWord;

        // 동적 쿼리를 위한 조건 빌더
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(myWord.member.id.eq(memberId)); // memberId 조건 추가
        builder.and(myWord.isDeleted.eq(false)); // isDeleted 조건 추가

        // keyword가 존재하면 LIKE 조건 추가
        if (keyword != null && !keyword.isEmpty()) {
            builder.and(word.word.likeIgnoreCase("%" + keyword + "%")); // keyword 조건 추가
        }

        return queryFactory
                .select(myWord.count())
                .from(myWord)
                .join(word).on(myWord.word.id.eq(word.id))
                .where(builder)
                .fetchFirst();
    }
}
