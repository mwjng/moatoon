package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.schedule.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/sessions")
    public ResponseEntity<String> initializeSession(
        @RequestBody(required = false) Map<String, Object> params
    ) {
        return ResponseEntity.ok().body(sessionService.initializeSession(params));
    }

    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(
        @PathVariable("sessionId") String sessionId,
        @RequestBody(required = false) Map<String, Object> params
    ) {
        return ResponseEntity.ok().body(sessionService.createConnection(sessionId, params));
    }
}
