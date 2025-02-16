package com._2.a401.moa.member.service;

import com._2.a401.moa.auth.exception.AuthException;
import com._2.a401.moa.auth.service.MailService;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberRole;
import com._2.a401.moa.member.domain.MemberState;
import com._2.a401.moa.member.dto.request.FindPwRequest;
import com._2.a401.moa.member.dto.request.FindIdRequest;
import com._2.a401.moa.member.dto.request.MemberCreate;
import com._2.a401.moa.member.dto.request.MemberModify;
import com._2.a401.moa.member.dto.response.*;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.repository.PartyMemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com._2.a401.moa.common.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final JwtUtil jwtUtil;

    @Transactional
    public void createMember(MemberCreate memberCreate) {
        if (memberCreate.isChild()) {
            createChildren(memberCreate);
        } else {
            createManager(memberCreate);
        }
    }

    private void createChildren(MemberCreate memberCreate) {
        memberRepository.save(memberCreate.toChildMember(passwordEncoder));
    }

    private void createManager(MemberCreate memberCreate) {
        Member manager = memberRepository.save(memberCreate.toManageMember(passwordEncoder));
        connectChildren(memberCreate.getChildren(), manager);
    }

    private void connectChildren(List<Long> children, Member manager) {
        if (children != null) {
            List<Member> members = children.stream()
                    .map(this::getMember)
                    .toList();

            members.forEach(child -> child.setManager(manager));
        }
    }

    private Member getMember(Long childId) {
        return memberRepository.findByIdAndStatus(childId, MemberState.ACTIVE)
                .orElseThrow(() -> new MoaException(INVALID_MEMBER));
    }

    public MemberInfoResponse getUserInfo(long memberId) {
        Member member = memberRepository.findByIdAndStatus(memberId, MemberState.ACTIVE)
                .orElseThrow(() -> new MoaException(INVALID_MEMBER));

        if (member.getRole() == MemberRole.MANAGER) {
            List<Member> children = memberRepository.findByManager(member);
            return MemberInfoResponse.ofManager(member, children);
        }else if(member.getManager()==null){
            throw new MoaException(UNCONNECTED_CHILD);
        }

        return MemberInfoResponse.ofChild(member);
    }

    public SearchChildInfo getChildInfoById(String loginId) {
        Member member = memberRepository.findByLoginIdAndStatus(loginId, MemberState.ACTIVE)
                .orElseThrow(() -> new MoaException(INVALID_MEMBER));

        if (!member.getRole().equals(MemberRole.CHILD)) {
            throw new MoaException(INVALID_MEMBER);
        }
        if (member.getManager()!=null) {
            throw new MoaException(DUPLICATED_CHILD);
        }
        return SearchChildInfo.from(member);
    }

    @Transactional
    public void sendUserPwMail(FindPwRequest req) {
        Member member = memberRepository.findByLoginId(req.loginId())
                .orElseThrow(()->new MoaException(INVALID_MEMBER));

        if(!member.getStatus().equals(MemberState.ACTIVE)){
            throw new MoaException(INVALID_MEMBER_STATUS);
        }

        if(member.getRole().equals(MemberRole.CHILD)){
            if(!member.getManager().getEmail().equals(req.email())){
                throw new MoaException(INVALID_MEMBER);
            }
        }else{
            if(!member.getEmail().equals(req.email())){
                throw new MoaException(INVALID_MEMBER);
            }
        }

        String newPw = getTempPassword();
        mailService.sendPwMail(req.email(), newPw);
        member.setPassword(passwordEncoder.encode(newPw));
    }

    public FindIdInfo getLoginIdByNameAndEmail(FindIdRequest req) {
        Member member = memberRepository.findByEmailAndName(req.email(), req.name())
                .orElseThrow(()->new MoaException(INVALID_MEMBER));
        if (!member.getStatus().equals(MemberState.ACTIVE)){
             throw new MoaException(INVALID_MEMBER_STATUS);
        }

        return FindIdInfo.from(member);
    }

    @Transactional
    public MemberInfoResponse modifyMember(@Valid MemberModify memberModify, HttpServletRequest req) {
        long memberId = jwtUtil.getMemberId(jwtUtil.getTokenFromRequest(req));
        Member member = memberRepository.findById(memberId).orElseThrow(()->new MoaException(INVALID_MEMBER));

        member.setImageUrl(memberModify.getImgUrl());
        member.setNickname(memberModify.getNickname());

        if(memberModify.getPassword() != null && !memberModify.getPassword().isBlank()){
            validatePassword(memberModify.getPassword());
            member.setPassword(passwordEncoder.encode(memberModify.getPassword()));
            System.out.println(memberModify.getPassword());
            System.out.println("??");
        }
        if(member.getRole().equals(MemberRole.MANAGER) ){
            List<Member> members = memberRepository.findByManagerIdAndStatus(memberId, MemberState.ACTIVE);
            members.forEach(child -> child.setManager(null));

            connectChildren(memberModify.getChildren(), member);
        }
        MemberInfoResponse info = getUserInfo(memberId);
        return info;
    }

    private void validatePassword(String password) {
        if (password.length() < 8|| password.length()>20) {
            throw new IllegalArgumentException("비밀번호는 8자 이상 20자 이내여야 합니다.");
        }
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new IllegalArgumentException("비밀번호에는 최소 한 개의 특수 문자가 포함되어야 합니다.");
        }
    }

    @Transactional
    public void deleteMember(HttpServletRequest req) {
        Member member = memberRepository.findById(jwtUtil.getMemberId(jwtUtil.getTokenFromRequest(req))).orElseThrow(()->new MoaException(INVALID_MEMBER));
        member.setStatus(MemberState.DELETED);
        if(member.getRole().equals(MemberRole.MANAGER)){
            memberRepository.findByManagerId(member.getId())
                    .forEach(m -> {
                        m.setManager(null);
                        partyMemberRepository.findByMember(m)
                                .stream()
                                .filter(partyMember -> partyMember.getParty().getStatus() == PartyState.BEFORE)
                                .forEach(partyMemberRepository::delete);
                    });
        }else{
            partyMemberRepository.findByMember(member).stream()
                    .filter(partyMember -> partyMember.getParty().getStatus() == PartyState.BEFORE)
                    .forEach(partyMemberRepository::delete);
        }
    }

    public List<ChildInfo> getChildrenInfo(HttpServletRequest req) {
        List<Member> members = memberRepository.findByManagerIdAndStatus(jwtUtil.getMemberId(jwtUtil.getTokenFromRequest(req)), MemberState.ACTIVE);
        return members.stream()
                .map(ChildInfo::from)
                .toList();
    }

    public String getTempPassword(){
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };

        String str = "";

        int idx = 0;
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            str += charSet[idx];
        }
        return str;
    }
}
