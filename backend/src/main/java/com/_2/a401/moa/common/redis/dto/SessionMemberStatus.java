package com._2.a401.moa.common.redis.dto;

import lombok.Builder;

@Builder
public record SessionMemberStatus(
        boolean isConnect,
        boolean isReady
) {}