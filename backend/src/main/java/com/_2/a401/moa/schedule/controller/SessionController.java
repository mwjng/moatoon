package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.auth.dto.MemberDetails;
import com._2.a401.moa.schedule.dto.response.SessionTokenResponse;
import com._2.a401.moa.schedule.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/schedules")
@RestController
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/{scheduleId}/session/join")
    public ResponseEntity<SessionTokenResponse> joinSession(
        @AuthenticationPrincipal MemberDetails memberDetails,
        @PathVariable("scheduleId") Long scheduleId
    ) {
        return ResponseEntity.ok(sessionService.join(memberDetails.getMember(), scheduleId));
    }

    @DeleteMapping("/{scheduleId}/session/leave")
    public ResponseEntity<Void> leaveSession(
        @AuthenticationPrincipal MemberDetails memberDetails,
        @PathVariable("scheduleId") Long scheduleId
    ) {
        sessionService.leave(memberDetails.getMember(), scheduleId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{scheduleId}/session/close")
    public ResponseEntity<Void> closeSession(
        @PathVariable("scheduleId") Long scheduleId
    ) {
        sessionService.close(scheduleId);
        return ResponseEntity.noContent().build();
    }
}
