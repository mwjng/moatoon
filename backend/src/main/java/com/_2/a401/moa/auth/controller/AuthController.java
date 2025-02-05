package com._2.a401.moa.auth.controller;

import com._2.a401.moa.auth.service.AuthService;
import com._2.a401.moa.auth.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final MailService mailService;

    @PostMapping("/email/check")
    public ResponseEntity<String> checkEmailInRegist(@RequestBody Map<String, String> request){
        String email = request.get("email").trim();
        if(authService.checkEmailDup(email)){
            return new ResponseEntity<>("이미 존재하는 이메일", HttpStatus.CONFLICT);
        }
        if(mailService.sendCodeMail(email)){
            return new ResponseEntity<>("이메일 코드 전송 성공", HttpStatus.OK);
        }
        return new ResponseEntity<>("이메일 코드 전송 실패", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
