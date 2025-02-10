package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.schedule.dto.response.MonthlyChildrenSchedulesResponse;
import com._2.a401.moa.schedule.dto.response.TodayAndUpcomingScheduleResponse;
import com._2.a401.moa.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final JwtUtil jwtUtil;

    @GetMapping("/manager")
    public ResponseEntity<MonthlyChildrenSchedulesResponse> getMonthlyChildrenSchedules(@RequestParam("year") int year, @RequestParam("month") int month) {
        return ResponseEntity.ok(scheduleService.getMonthlyChildrenSchedules(year, month));
    }

    @Operation(summary="오늘 & 다가오는 일정 조회", description="오늘 일정과 다가오는 일정을 조회합니다.")
    @GetMapping("/upcoming")
    public ResponseEntity<TodayAndUpcomingScheduleResponse> getTodayAndUpcomingSchedule(@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.getMemberId(token.substring(7)); //Bearer까지 넘어와서 이렇게 처리함
        return ResponseEntity.ok(scheduleService.getTodayAndUpcomingSchedule(memberId));
    }
}
