package com._2.a401.moa.member.service;

import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberRole;
import com._2.a401.moa.member.dto.request.MemberCreate;
import com._2.a401.moa.member.dto.response.SearchChildInfo;
import com._2.a401.moa.member.dto.response.MemberInfoResponse;
import com._2.a401.moa.member.repository.MemberRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com._2.a401.moa.common.exception.ExceptionCode.DUPLICATED_CHILD;
import static com._2.a401.moa.common.exception.ExceptionCode.INVALID_MEMBER;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void createMember(@Valid MemberCreate memberCreate) {
        Member manager = memberRepository.save(memberCreate.toMember(passwordEncoder));

        if(memberCreate.getChildren()!=null){
            List<Member> children = new ArrayList<>();
            for(long childId :memberCreate.getChildren()){
                memberRepository.findById(childId).ifPresent(children::add);
            }

            children.forEach(child -> child.setManager(manager));

            memberRepository.saveAll(children);
        }
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

    public SearchChildInfo getChildInfoById(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new MoaException(INVALID_MEMBER));

        if (!member.getRole().equals(MemberRole.CHILD)) {
            throw new MoaException(INVALID_MEMBER);
        }
        if (member.getManager()!=null) {
            throw new MoaException(DUPLICATED_CHILD);
        }
        return SearchChildInfo.from(member);
    }
}
