package com._2.a401.moa.schedule.repository;

import com._2.a401.moa.schedule.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}
