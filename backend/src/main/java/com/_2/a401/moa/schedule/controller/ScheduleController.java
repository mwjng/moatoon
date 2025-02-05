package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.schedule.dto.response.MonthlyChildrenSchedulesResponse;
import com._2.a401.moa.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("/manager")
    public ResponseEntity<MonthlyChildrenSchedulesResponse> getMonthlyChildrenSchedules(@RequestParam("year") int year, @RequestParam("month") int month) {
        MonthlyChildrenSchedulesResponse response = scheduleService.getMonthlyChildrenSchedules(year, month);
        return ResponseEntity.ok(response);
    }
}
