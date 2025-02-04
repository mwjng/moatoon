package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PartyRepository extends JpaRepository<Party, Long> {

    @Query(value = """
        SELECT s.episode_number, p.level
        FROM schedule s
        JOIN party p ON s.party_id = p.id
        WHERE p.id = :partyId
        AND DATE(s.session_time) = CURRENT_DATE
        LIMIT 1
    """, nativeQuery = true)
    Optional<Object[]> findEpisodeNumberAndLevelByPartyIdAndToday(@Param("partyId") Long partyId);
}
