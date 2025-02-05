package com._2.a401.moa.auth.service;

import com._2.a401.moa.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;

    public boolean checkEmailDup(String email) {
//        return memberRepository.findEmailExist(email)>0;
        return false;
    }
}
