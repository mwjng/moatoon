package com._2.a401.moa.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    public void sendCodeMail(String email) {
        redisMailSevice.setCode(email, joinEmail(email));
    }


    public String joinEmail(String email) {
        String code = Integer.toString(makeRandomNumber());
        String content = String.format(EMAIL_CONTENT_TEMPLATE, code);
        mailSend(email, EMAIL_TITLE, content);
        return code;
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

    public String sendPwMail(String email) {
        String newPw = getTempPassword();
        String content = String.format(EMAIL_CONTENT_FOR_TEMP_TEMPLATE, newPw);
        mailSend(email, EMAIL_TITLE_FOR_TEMP_PW, content);
        return newPw;
    }
}
