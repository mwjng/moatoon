package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.domain.MyWord;
import com._2.a401.moa.word.dto.MyWordExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MyWordRepository extends JpaRepository<MyWord, Long> {

    @Query(value = """
        SELECT mw.id, w.word, w.meaning, mw.fail_count, we.example
        FROM my_word mw
        JOIN word w on mw.word_id = w.id
        JOIN word_example we on we.word_id = w.id
        WHERE mw.member_id = :memberId
        AND mw.is_deleted = false
        LIMIT :page, 8
    """, nativeQuery = true)
    List<MyWordExample> findAllWithId(Long memberId, int page);
}
