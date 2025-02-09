package com._2.a401.moa.common.redis.dto;

public enum SessionStage {
    BEFORE("10분 전 부터 입장 가능"),
    WAITING("대기 중"),
    WORD("단어 학습"),
    DRAWING("그림 그리기"),
    DONE("종료");

    private final String description;

    SessionStage(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}