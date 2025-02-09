package com._2.a401.moa.common.redis.dto;

import lombok.Builder;

import java.util.Map;

@Builder
public record RedisSessionInfo(
        Long sessionId, // openvidu SessionId
        SessionStage sessionStage // 세션 상태
) {}