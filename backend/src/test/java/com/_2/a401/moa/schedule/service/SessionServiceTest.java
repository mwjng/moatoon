package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest
class SessionServiceTest {

    @Autowired
    VideoConferenceManager videoConferenceManager;

    @Test
    void getSessionIdAndTokenFromOpenVidu() throws InterruptedException {
        final String sessionId = videoConferenceManager.createSession();
        System.out.println("sessionId = " + sessionId);
        Thread.sleep(10000);
        final String token = videoConferenceManager.createConnection(sessionId);
        System.out.println("token = " + token);
    }
}