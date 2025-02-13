package com._2.a401.moa.schedule.domain;

public enum FullSessionStage {
    // TODO: 시간 바꿔줘야함. (이거 기준으로 프론트 네비게이션 타이머 설정됨 + serverTime)
    WAITING(600L),    // 10분
    WORD(60L),      // 7분
    DRAWING(60L),   // 15분
    DONE(60L);   // 종료 (완성그림 단계부터는 프론트에서 다음으로 이동처리)

    private final Long duration;

    FullSessionStage(Long duration) {
        this.duration = duration;
    }

    public Long getDuration() {
        return duration;
    }

    public static FullSessionStage next(FullSessionStage stage) {
        return stage == DONE ? DONE : values()[stage.ordinal() + 1];
    }
}