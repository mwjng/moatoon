package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
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
    public String getMonthSchedules(@RequestParam("month") int month) {
        return "Schedules for month: " + month;
    }
}
