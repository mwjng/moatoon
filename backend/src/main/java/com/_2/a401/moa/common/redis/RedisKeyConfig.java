package com._2.a401.moa.common.redis;

public class RedisKeyConfig {
    private static final String SESSION_INFO_PREFIX = "sessionInfo:";
    private static final String SESSION_MEMBER_PREFIX = "sessionMember:";

    public static String getSessionInfoKey(Long sessionId) {
        return SESSION_INFO_PREFIX + sessionId;
    }

    public static String getSessionMemberKey(Long sessionId) {
        return SESSION_MEMBER_PREFIX + sessionId;
    }
}