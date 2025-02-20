package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.domain.MyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MyWordRepository extends JpaRepository<MyWord, Long>, CustomMyWordRepository {

    @Query(value = """
        SELECT mw.*
        FROM my_word mw
        WHERE mw.word_id = :wordId
        AND mw.member_id = :memberId
    """, nativeQuery = true)
    Optional<MyWord> findByIdAndMemberId(Long memberId, Long wordId);

    Optional<MyWord> findById(Long myWordId);
}
