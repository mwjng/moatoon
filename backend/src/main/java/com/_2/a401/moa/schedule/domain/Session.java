package com._2.a401.moa.schedule.domain;

import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Slf4j
@Getter
@RedisHash(value = "session", timeToLive = 5400)
@ToString
public class Session {

    @Id
    private Long scheduleId;

    private String sessionId;

    private FullSessionStage sessionStage;

    private LocalDateTime startTime; // 각 단계의 시작시간. 갱신됨.

    public Session(final Long scheduleId, final String sessionId, final FullSessionStage sessionStage, final LocalDateTime startTime) {
        this.scheduleId = scheduleId;
        this.sessionId = sessionId;
        this.sessionStage = sessionStage;
        this.startTime = startTime;
    }

    public void updateSessionStageAndStartTime(FullSessionStage sessionStage, LocalDateTime startTime) {
        this.sessionStage = sessionStage;
        this.startTime = startTime;
        log.info("Updating session stage and start time for scheduleId: {}, sessionId: {}, sessionStage:{}, startTime: {}", scheduleId, sessionId, sessionStage.toString(), startTime);
    }

    public void updateSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
