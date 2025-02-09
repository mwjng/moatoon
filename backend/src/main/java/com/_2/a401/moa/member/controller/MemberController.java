package com._2.a401.moa.member.controller;

import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.member.dto.request.MemberCreate;
import com._2.a401.moa.member.dto.response.MemberInfoResponse;
import com._2.a401.moa.member.service.MemberService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@RequiredArgsConstructor
@RestController
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @PostMapping("")
    public ResponseEntity<Void> createMember(@Valid @RequestBody final MemberCreate memberCreate) {
        memberService.createMember(memberCreate);
        return ResponseEntity.status(CREATED).build();
    }

    @GetMapping("")
    public ResponseEntity<MemberInfoResponse> getUserInfo(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);

        MemberInfoResponse memberInfoResponse = memberService.getUserInfo(jwtUtil.getMemberId(token));
        return ResponseEntity.ok().body(memberInfoResponse);
    }
}
