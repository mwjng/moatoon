package com._2.a401.moa.schedule.repository;

import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.dto.response.ScheduleInfoResponse;
import com._2.a401.moa.schedule.dto.response.ScheduleResponse;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
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
    List<ScheduleResponse> findSchedulesByMemberIdAndYearAndMonth(@Param("memberId") Long memberId,
                                                                  @Param("year") int year,
                                                                  @Param("month") int month);

    @Query(value = "SELECT s.party_id, s.episode_number " +
            "FROM Schedule s " +
            "WHERE s.id = :scheduleId", nativeQuery = true)
    Optional<ScheduleInfoResponse> getScheduleInfo(@Param("scheduleId") Long scheduleId);

//    public interface ScheduleProjection {
//        int getScheduleId();
//        String getBookTitle();
//        LocalDateTime getSessionTime();
//    }
}
