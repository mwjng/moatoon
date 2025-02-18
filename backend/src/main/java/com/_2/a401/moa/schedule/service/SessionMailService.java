package com._2.a401.moa.schedule.service;

import com._2.a401.moa.auth.service.MailService;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com._2.a401.moa.common.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionMailService {

    private final MailService mailService;
    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    public void sendNotice(HttpServletRequest req, List<String> words) {
        Long memberId = jwtUtil.getMemberId(jwtUtil.getTokenFromRequest(req));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MoaException(INVALID_CHILD));
        String childName = member.getName();
        String managerEmail = member.getManager().getEmail();
        mailService.sendNoticeMail(managerEmail, childName, words);
    }

    public void sendBadChildNotice(List<Long> uncompletedMembers) {
        uncompletedMembers.forEach(memberId -> {
            Member member = memberRepository.findByIdWithManager(memberId) // 매니저 정보와 함께 아동 조회
                    .orElseThrow(() -> new MoaException(INVALID_CHILD));
            String childName = member.getName();
            Member manager = Optional.ofNullable(member.getManager())
                    .orElseThrow(() -> new MoaException(INVALID_MANAGER));
            String managerEmail = Optional.ofNullable(manager.getEmail())
                    .orElseThrow(() -> new MoaException(NO_INFO));
            mailService.sendBadChildNoticeMail(managerEmail, childName);
        });
    }
}
