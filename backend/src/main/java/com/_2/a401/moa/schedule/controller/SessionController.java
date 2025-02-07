package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.schedule.dto.request.SessionCreateRequest;
import com._2.a401.moa.schedule.dto.response.SessionCreateResponse;
import com._2.a401.moa.schedule.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/session/token")
    public ResponseEntity<SessionCreateResponse> getSessionToken(
        @RequestBody(required = false) SessionCreateRequest sessionCreateRequest
    ) {
        return ResponseEntity.ok().body(sessionService.createSession(sessionCreateRequest));
    }
}
