package com._2.a401.moa.schedule.repository;

import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.domain.ScheduleState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import com._2.a401.moa.schedule.dto.ScheduleInfo;
import com._2.a401.moa.schedule.dto.response.CalendarSchedule;
import com._2.a401.moa.schedule.dto.response.ScheduleInfoResponse;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com._2.a401.moa.common.exception.ExceptionCode.SCHEDULE_NOT_FOUND;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    default void validateExistsById(Long id) {
        if (!existsById(id)) {
            throw new MoaException(SCHEDULE_NOT_FOUND);
        }
    }

    default Schedule fetchById(Long id) {
        return findById(id)
            .orElseThrow(() -> new MoaException(SCHEDULE_NOT_FOUND));
    }

    List<Schedule> findBySessionTimeBetweenAndStatus(LocalDateTime now,
                                                     LocalDateTime thirtyMinutesLater,
                                                     ScheduleState scheduleState);

    @Modifying
    @Query("UPDATE Schedule schedule " +
            "SET schedule.status = :scheduleState " +
            "WHERE schedule.id IN :scheduleIds")
    void bulkUpdateScheduleStatus(Set<Long> scheduleIds, ScheduleState scheduleState);

    @Modifying
    @Query("UPDATE Schedule schedule " +
            "SET schedule.status = 'DONE' " +
            "WHERE schedule.id = :scheduleId")
    void completeScheduleById(@Param("scheduleId") Long scheduleId);

    // FORMATDATETIME(s.session_time, 'yyyy-MM-dd HH:mm:ss') AS sessionTime - (H2용)
    // DATE_FORMAT(s.session_time, '%Y-%m-%dT%H:%i:%s') AS sessionTime - (MySql용)
    @Query(value = """
        SELECT s.id AS scheduleId,
               p.book_title AS bookTitle,
               DATE_FORMAT(s.session_time, '%Y-%m-%dT%H:%i:%s') AS sessionTime
        FROM party_member pm
        JOIN party p ON pm.party_id = p.id
        JOIN schedule s ON p.id = s.party_id
        WHERE pm.member_id = :memberId
        AND YEAR(s.session_time) = :year
        AND MONTH(s.session_time) = :month
        ORDER BY s.session_time
        """, nativeQuery = true)
    List<CalendarSchedule> findSchedulesByMemberIdAndYearAndMonth(@Param("memberId") Long memberId,
                                                                  @Param("year") int year,
                                                                  @Param("month") int month);

    @Query(value = """
            SELECT s.id as scheduleId,
                   p.book_title as bookTitle,
                   p.book_cover as bookCover,
                   s.episode_number as episodeNumber,
                   DATE_FORMAT(s.session_time, '%Y-%m-%dT%H:%i:%s') AS sessionTime,
                   s.status as status,
                   p.pin_number as pinNumber
            FROM schedule s
            JOIN party p ON s.party_id = p.id
            JOIN party_member pm ON p.id = pm.party_id
            AND s.status != 'DONE'
            AND pm.member_id = :memberId
            ORDER BY s.session_time
            LIMIT 4
    """, nativeQuery = true)
    List<ScheduleInfo> findBeforeAndOngoingSchedules(@Param("memberId") Long memberId);

    @Query(value = "SELECT s.party_id, s.episode_number " +
            "FROM Schedule s " +
            "WHERE s.id = :scheduleId", nativeQuery = true)
    Optional<ScheduleInfoResponse> getScheduleInfo(@Param("scheduleId") Long scheduleId);

    List<Schedule> findByPartyIdOrderBySessionTimeAsc(Long partyId);

    @Query("""
    SELECT s.id FROM Schedule s
    WHERE s.party.id = :partyId
    AND s.sessionTime >= :startOfDay
    AND s.sessionTime < :endOfDay
""")
    Optional<Long> findTodayScheduleIdByPartyId(@Param("partyId") Long partyId,
                                                @Param("startOfDay") LocalDateTime startOfDay,
                                                @Param("endOfDay") LocalDateTime endOfDay);


    @Query(value = "SELECT party_id FROM schedule WHERE id = :scheduleId", nativeQuery = true)
    Optional<Long> findPartyIdById(@Param("scheduleId") Long scheduleId);

    @Query(value = "SELECT s.id, s.party_id FROM schedule s WHERE s.id IN :scheduleIds", nativeQuery = true)
    List<Object[]> findPartyIdsByScheduleIds(@Param("scheduleIds") List<Long> scheduleIds);

    List<Schedule> findAllByParty(Party party);
}
