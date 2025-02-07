package com._2.a401.moa.schedule.repository;

import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.domain.ScheduleState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findBySessionTimeBetweenAndStatus(LocalDateTime now,
                                                     LocalDateTime thirtyMinutesLater,
                                                     ScheduleState scheduleState);

    @Modifying
    @Query("UPDATE Schedule schedule " +
            "SET schedule.status = :scheduleState " +
            "WHERE schedule.id IN :scheduleIds")
    void bulkUpdateScheduleStatus(Set<Long> scheduleIds, ScheduleState scheduleState);
}
