package com._2.a401.moa.common.redis.dto;

import lombok.Builder;

import java.util.Map;

@Builder
public record SessionRedisInfo(
        String sessionToken, // 입장을 위한 세션 토큰
        String sessionStage, // 세션 상태
        Map<Long, SessionMemberStatus> memberStatuses // 멤버상태 (key: memberId)
) {}