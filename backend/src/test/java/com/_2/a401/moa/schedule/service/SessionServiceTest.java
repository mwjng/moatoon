package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.manager.VideoConferenceManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest
class SessionServiceTest {

    @Autowired
    VideoConferenceManager videoConferenceManager;

    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    private TaskScheduler taskScheduler;

    @Test
    void getSessionIdAndTokenFromOpenVidu() throws InterruptedException {
        final String sessionId = videoConferenceManager.createSession();
        System.out.println("sessionId = " + sessionId);
        Thread.sleep(10000);
        final String token = videoConferenceManager.createConnection(sessionId);
        System.out.println("token = " + token);
    }

    @Test
    void testScheduledTaskSchedulerBeanName() {
        String[] beanNames = applicationContext.getBeanNamesForType(TaskScheduler.class);
        Arrays.stream(beanNames).forEach(name -> {
            Object bean = applicationContext.getBean(name);
            if (bean == taskScheduler) {
                System.out.println("현재 @Scheduled에서 사용되는 TaskScheduler 빈 이름: " + name);
            }
        });
        System.out.println("현재 사용 중인 TaskScheduler 클래스: " + taskScheduler.getClass().getName());
    }

    @Scheduled(fixedRate = 5000)
    public void testScheduledTask() {
        System.out.println("@Scheduled 실행 중 - 현재 스레드: " + Thread.currentThread().getName());
    }
}