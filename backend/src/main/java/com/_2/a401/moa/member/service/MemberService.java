package com._2.a401.moa.member.service;

import com._2.a401.moa.member.dto.request.MemberCreate;
import com._2.a401.moa.member.repository.MemberRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void createMember(@Valid MemberCreate memberCreate) {
        memberRepository.save(memberCreate.toMember(passwordEncoder));
    }
}
