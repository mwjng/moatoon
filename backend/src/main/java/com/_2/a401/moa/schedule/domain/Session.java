package com._2.a401.moa.schedule.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@RedisHash(value = "session", timeToLive = 5400)
public class Session {

    @Id
    private Long scheduleId;

    private String sessionId;

    private SessionStage sessionStage;

    public Session(final Long scheduleId, final String sessionId, final SessionStage sessionStage) {
        this.scheduleId = scheduleId;
        this.sessionId = sessionId;
        this.sessionStage = sessionStage;
    }
}
