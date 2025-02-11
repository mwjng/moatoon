package com._2.a401.moa.member.controller;

import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.member.dto.request.FindIdRequest;
import com._2.a401.moa.member.dto.request.FindPwRequest;
import com._2.a401.moa.member.dto.request.MemberCreate;
import com._2.a401.moa.member.dto.response.FindIdInfo;
import com._2.a401.moa.member.dto.response.SearchChildInfo;
import com._2.a401.moa.member.dto.response.MemberInfoResponse;
import com._2.a401.moa.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@RequiredArgsConstructor
@RestController
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Void> createMember(@Valid @RequestBody final MemberCreate memberCreate) {
        memberService.createMember(memberCreate);
        return ResponseEntity.status(CREATED).build();
    }

    @GetMapping
    public ResponseEntity<MemberInfoResponse> getUserInfo(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);

        MemberInfoResponse memberInfoResponse = memberService.getUserInfo(jwtUtil.getMemberId(token));
        return ResponseEntity.ok().body(memberInfoResponse);
    }

    @GetMapping("/search")
    public ResponseEntity<SearchChildInfo> getChildInfoById(@RequestParam String loginId){
        SearchChildInfo searchChildInfo = memberService.getChildInfoById(loginId);
        return ResponseEntity.ok().body(searchChildInfo);
    }

    @PostMapping("/password")
    public ResponseEntity<Void> sendUserPw(@RequestBody FindPwRequest req){
        memberService.sendUserPwMail(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/managers/id")
    public ResponseEntity<FindIdInfo> findLoginId(@RequestBody FindIdRequest req){
        FindIdInfo findIdInfo = memberService.getLoginIdByNameAndEmail(req);
        return ResponseEntity.ok().body(findIdInfo);
    }
}
