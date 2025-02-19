package com._2.a401.moa.schedule.domain;

public enum FullSessionStage {
    // TODO: 시간 바꿔줘야함. (이거 기준으로 프론트 네비게이션 타이머 설정됨 + serverTime)
    WAITING(60L),    // TODO: 10분
    WORD(60L),      // TODO:7분
    CUT_ASSIGN(7L), //
    DRAWING(60L),   // TODO:15분
    DONE(120L),    // 퀴즈 종료 8분 뒤 이메일 알람 설정 위함
    TIMER_END(0L);     // 타이머 종료 상태

    private final Long duration; // SECOND 기준

    FullSessionStage(Long duration) {
        this.duration = duration;
    }

    public Long getDuration() {
        return duration;
    }

    public static FullSessionStage next(FullSessionStage stage) {
        return stage == DONE ? TIMER_END : values()[stage.ordinal() + 1]; // DONE이면 TIMER_END를 반환
    }
}