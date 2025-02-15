package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.schedule.dto.request.ReadyRequest;
import com._2.a401.moa.schedule.dto.response.CurrentSessionStageResponse;
import com._2.a401.moa.schedule.service.SessionStageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class SessionStageController {
    private final JwtUtil jwtUtil;
    private final SessionStageService sessionStageService;

    @Operation(summary = "현재 시간을 기준으로 scheduleId의 대기방 생성, 멤버에는 memberId 참여")
    @GetMapping("/redis-dummy")
    public void testRedis(@RequestParam Long scheduleId, @RequestParam Long memberId) {
        sessionStageService.dummyRedis(scheduleId, memberId);
    }

    @Operation(summary = "세션 stage 정보 조회", description = "현재 세션의 단계와, 시작시간, 서버시간을 얻어옵니다.")
    @GetMapping("schedules/{scheduleId}/session/current-stage")
    public ResponseEntity<CurrentSessionStageResponse> getCurrentSessionStage (
            @PathVariable("scheduleId") Long scheduleId
    ) {
        return ResponseEntity.ok(sessionStageService.getCurrentSessionStage(scheduleId));
    }

    @MessageMapping("/ready")
    public void updateReadyStatus(ReadyRequest request) {
        String token = request.accessToken();
        Long memberId = jwtUtil.getMemberId(token);
        sessionStageService.updateReadyStatus(request.scheduleId(), memberId, true); // 확장성(ready 해제)을 위해 true 파라미터도 넣음
    }
}
