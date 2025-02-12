package com._2.a401.moa.schedule.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Getter
@RedisHash(value = "session", timeToLive = 5400)
public class Session {

    @Id
    private Long scheduleId;

    private String sessionId;

    private FullSessionStage sessionStage;

    private LocalDateTime startTime; // 재접속시, 타이머를 위함

    public Session(final Long scheduleId, final String sessionId, final FullSessionStage sessionStage) {
        this.scheduleId = scheduleId;
        this.sessionId = sessionId;
        this.sessionStage = sessionStage;
    }

    public void updateSessionStageAndStartTime(FullSessionStage sessionStage, LocalDateTime startTime) {
        this.sessionStage = sessionStage;
        this.startTime = startTime;
    }
}
