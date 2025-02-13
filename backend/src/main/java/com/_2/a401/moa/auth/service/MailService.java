package com._2.a401.moa.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MailService {

    private final RedisMailSevice redisMailSevice;
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String setFrom;
    private static final String EMAIL_TITLE = "모아책방 회원 가입 인증번호";
    private static final String EMAIL_CONTENT_TEMPLATE = "아래의 인증번호를 입력하여 회원가입을 완료해주세요."+
            "<br><br>" +
            "인증번호 %s";
    private static final String EMAIL_TITLE_FOR_TEMP_PW = "모아책방 임시 비밀번호";
    private static final String EMAIL_CONTENT_FOR_TEMP_TEMPLATE = "아래의 임시 비밀번호를 통해 로그인 후 비밀번호를 변경해주세요."+
            "<br><br>" +
            "임시 비밀번호 %s";

    @Async
    public void sendCodeMail(String email) {
        String code = Integer.toString(makeRandomNumber());
        joinEmail(email, code);
        redisMailSevice.setCode(email, code);
    }

    public void joinEmail(String email, String code) {
        String content = String.format(EMAIL_CONTENT_TEMPLATE, code);
        mailSend(email, EMAIL_TITLE, content);
    }


    public void mailSend(String toMail, String title, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();
        if (!toMail.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
            throw new IllegalArgumentException("잘못된 이메일 형식: " + toMail);
        }
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");
            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content,true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("메일 전송 실패: " + e.getMessage(), e);
        }

    }

    public int makeRandomNumber() {
        Random r = new Random();
        StringBuilder randomNumber = new StringBuilder();
        for(int i = 0; i < 6; i++) {
            randomNumber.append(r.nextInt(10));
        }
        return Integer.parseInt(randomNumber.toString());
    }

    @Async
    public void sendPwMail(String email, String code) {
        String content = String.format(EMAIL_CONTENT_FOR_TEMP_TEMPLATE, code);
        mailSend(email, EMAIL_TITLE_FOR_TEMP_PW, content);
    }
}
