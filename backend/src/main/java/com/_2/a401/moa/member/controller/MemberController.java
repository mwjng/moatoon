package com._2.a401.moa.member.controller;

import com._2.a401.moa.member.dto.request.MemberCreate;
import com._2.a401.moa.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.CREATED;

@RequiredArgsConstructor
@RestController
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("")
    public ResponseEntity<Void> createMember(@Valid @RequestBody final MemberCreate memberCreate) {
        System.out.println("???");
        memberService.createMember(memberCreate);
        return ResponseEntity.status(CREATED).build();
    }
}
