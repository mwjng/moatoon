package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.schedule.domain.Day;
import com._2.a401.moa.word.dto.EpisodeNumberAndLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PartyRepository extends JpaRepository<Party, Long>, CustomPartyRepository {
    Optional<Party> findById(Long partyId);

    @Query(value = """
        SELECT s.episode_number, p.level
        FROM schedule s
        JOIN party p ON s.party_id = p.id
        WHERE p.id = :partyId
        AND s.session_time >= CURRENT_DATE
        AND s.session_time < DATEADD('DAY', 1, CURRENT_DATE)
        LIMIT 1
    """, nativeQuery = true)
    Optional<EpisodeNumberAndLevel> findEpisodeNumberAndLevelByPartyIdAndToday(@Param("partyId") Long partyId);


    @Query("SELECT DISTINCT p FROM Party p " +
            "JOIN FETCH p.schedules s " +
            "WHERE p.isPublic = true " +
            "AND p.status = 'BEFORE' " +
            "AND (:startDate IS NULL OR p.startDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.endDate <= :endDate) " +
            "AND (:level IS NULL OR p.level = :level) " +
            "AND (:episodeLength IS NULL OR p.episodeCount = :episodeLength) " +
            "AND (:dayWeek IS NULL OR s.dayWeek IN :dayWeek) " +
            "AND (:time IS NULL OR FUNCTION('TIME_FORMAT', s.sessionTime, '%H:%i') = :time) ")
    List<Party> searchParties(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("level") Integer level,
            @Param("episodeLength") Integer episodeLength,
            @Param("dayWeek") List<String> dayWeek,
            @Param("time") String time
    );

    boolean existsByPinNumber(String pinNumber);

}
