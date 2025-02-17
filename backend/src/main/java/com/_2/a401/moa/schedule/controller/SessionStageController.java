package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.auth.dto.MemberDetails;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.schedule.dto.request.ReadyRequest;
import com._2.a401.moa.schedule.dto.response.CurrentSessionStageResponse;
import com._2.a401.moa.schedule.service.SessionService;
import com._2.a401.moa.schedule.service.SessionStageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class SessionStageController {
    private final JwtUtil jwtUtil;
    private final SessionStageService sessionStageService;
    private final SessionService sessionService;

    @Operation(summary = "REDIS 더미 데이터", description = "scheduleId의 대기방 생성, 멤버에는 아동 memberId 참여")
    @GetMapping("/redis-dummy")
    public void testRedis(@RequestParam Long scheduleId, @RequestParam List<Long> memberIds) {
        sessionStageService.dummyRedis(scheduleId, memberIds);
    }

    @Operation(summary = "세션 stage 정보 조회", description = "현재 세션의 단계와, 시작시간, 서버시간을 얻어옵니다.")
    @GetMapping("schedules/{scheduleId}/session/current-stage")
    public ResponseEntity<CurrentSessionStageResponse> getCurrentSessionStage (
            @PathVariable("scheduleId") Long scheduleId
    ) {
        return ResponseEntity.ok(sessionStageService.getCurrentSessionStage(scheduleId));
    }

    @PostMapping("schedules/{scheduleId}/quiz-done")
    public ResponseEntity<Void> quizDone (
            @AuthenticationPrincipal MemberDetails memberDetails,
            @PathVariable("scheduleId") Long scheduleId
    ){
        sessionStageService.quizDone(scheduleId, memberDetails.getMember().getId());
        return ResponseEntity.ok().build();
    }

    @MessageMapping("/ready")
    public void updateReadyStatus(ReadyRequest request) {
        String token = request.accessToken();
        Long memberId = jwtUtil.getMemberId(token);
        sessionStageService.updateReadyStatus(request.scheduleId(), memberId, true); // 확장성(ready 해제)을 위해 true 파라미터도 넣음
    }
}
