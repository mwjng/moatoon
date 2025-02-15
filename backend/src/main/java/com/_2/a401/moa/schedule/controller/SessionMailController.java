package com._2.a401.moa.schedule.controller;

import com._2.a401.moa.schedule.dto.request.NoticeRequest;
import com._2.a401.moa.schedule.service.SessionMailService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/mail")
@RestController
public class SessionMailController {

    private final SessionMailService sessionMailService;

    @PostMapping("/notice")
    public ResponseEntity<Void> sendNotice(HttpServletRequest req, @RequestBody NoticeRequest words){
        sessionMailService.sendNotice(req, words.words());
        return ResponseEntity.noContent().build();
    }

}
