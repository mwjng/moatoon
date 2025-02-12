package com._2.a401.moa.schedule.domain;

public enum FullSessionStage {
    WAITING(600L),    // 10분
    WORD(420L),      // 7분
    DRAWING(900L),   // 15분
    SHARING(180L),   // 3분
    QUIZ(300L),      // 5분
    DONE(0L);        // 종료

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