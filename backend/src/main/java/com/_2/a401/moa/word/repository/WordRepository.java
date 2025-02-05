package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.domain.Word;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    @Query(value = """
        SELECT * FROM word 
        WHERE level = :level
        ORDER BY RAND()
        LIMIT 4
    """, nativeQuery = true)
    List<Word> findRandomWordsByLevel(@Param("level") int level);
}
