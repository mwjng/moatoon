package com._2.a401.moa.audio.domain;

public enum AudioType {
    // 단일 파일
    WAITING("01.대기방.mp3"),
    WORD("02.사전학습.mp3"),
    FULLCUT("03.전체컷보기.mp3"),
    MYCUT("04.내컷보기.mp3"),
    SHARING("14.완성그림보기.mp3"),
    QUIZ("15.퀴즈.mp3"),
    MYPAGE("16.세션종료.mp3"),

    // 랜덤 재생
    TEN_LEFT,
    FIVE_LEFT,
    ONE_LEFT;

    private final String fileName;

    AudioType(String fileName) {
        this.fileName = fileName;
    }

    AudioType() {
        this.fileName = null;
    }

    public String getFileName() {
        return fileName;
    }

    public boolean isRandomType() {
        return this == TEN_LEFT || this == FIVE_LEFT || this == ONE_LEFT;
    }
}