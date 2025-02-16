package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.word.dto.EpisodeNumberAndLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PartyRepository extends JpaRepository<Party, Long>, CustomPartyRepository {
    Optional<Party> findById(Long partyId);

    // h2: DATEADD('DAY', 1, CURRENT_DATE)
    @Query(value = """
        SELECT s.episode_number, p.level
        FROM schedule s
        JOIN party p ON s.party_id = p.id
        WHERE p.id = :partyId
        AND s.session_time >= CURRENT_DATE
        AND s.session_time < CURRENT_DATE + INTERVAL 1 DAY
        LIMIT 1
    """, nativeQuery = true)
    Optional<EpisodeNumberAndLevel> findEpisodeNumberAndLevelByPartyIdAndToday(@Param("partyId") Long partyId);

    Optional<Party> findByPinNumberAndStatus(String PinNumber, PartyState state);

    @Query("SELECT p FROM Party p " +
            "WHERE p.startDate BETWEEN :now AND :thirtyMinutesLater " +
            "AND p.status = 'BEFORE'")
    List<Party> findPartiesStartingSoon(
            @Param("now") LocalDateTime now,
            @Param("thirtyMinutesLater") LocalDateTime thirtyMinutesLater
    );

    @Query("SELECT p.id FROM Party p WHERE p.pinNumber = :pinNumber")
    Optional<Long> findPartyIdByPinNumber(@Param("pinNumber") String pinNumber);

}
