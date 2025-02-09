package com._2.a401.moa.member.service;

import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberRole;
import com._2.a401.moa.member.dto.request.MemberCreate;
import com._2.a401.moa.member.dto.response.MemberInfoResponse;
import com._2.a401.moa.member.repository.MemberRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com._2.a401.moa.common.exception.ExceptionCode.INVALID_MEMBER;

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

    public MemberInfoResponse getUserInfo(long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MoaException(INVALID_MEMBER));

        if (member.getRole() == MemberRole.MANAGER) {
            List<Member> children = memberRepository.findByManager(member);
            return MemberInfoResponse.ofManager(member, children);
        }

        return MemberInfoResponse.ofChild(member);
    }
}
