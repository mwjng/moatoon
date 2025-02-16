package com._2.a401.moa.schedule.service;

import com._2.a401.moa.auth.service.MailService;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.member.service.MemberService;
import com._2.a401.moa.schedule.dto.request.NoticeRequest;
import com._2.a401.moa.word.domain.Word;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com._2.a401.moa.common.exception.ExceptionCode.INVALID_CHILD;
import static com._2.a401.moa.common.exception.ExceptionCode.INVALID_USER_ID;

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
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new MoaException(INVALID_CHILD));
            String childName = member.getName();
            String managerEmail = member.getManager().getEmail();
            mailService.sendBadChildNoticeMail(managerEmail, childName);
        });
    }
}
