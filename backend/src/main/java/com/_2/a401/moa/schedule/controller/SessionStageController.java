package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.schedule.dto.request.ReadyRequest;
import com._2.a401.moa.schedule.service.SessionStageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class SessionStageController {
    private final JwtUtil jwtUtil;
    private final SessionStageService sessionStageService;

    @GetMapping("/test-redis")
    public void testRedis() {
        sessionStageService.dummyRedis();
    }

    @MessageMapping("/ready")
    public void updateReadyStatus(ReadyRequest request) {
        String token = request.accessToken();
        Long memberId = jwtUtil.getMemberId(token);
        sessionStageService.updateReadyStatus(request.scheduleId(), memberId, true); // 확장성(ready 해제)을 위해 true 파라미터도 넣음
    }
}
