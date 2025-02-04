package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.domain.WordExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WordExampleRepository extends JpaRepository<WordExample, Long> {

    @Query(value = """
        SELECT we.*
        FROM word_example we
        JOIN word w ON we.word_id = w.id
        JOIN cut c ON w.id = c.word_id
        WHERE c.party_id = :partyId
        ORDER BY we.id
    """, nativeQuery = true)
    List<WordExample> findExamplesByPartyIdAndEpisodeNumber(@Param("partyId") Long partyId);
}
