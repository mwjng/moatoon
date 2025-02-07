package com._2.a401.moa.common.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public enum ExceptionCode {

    INVALID_REQUEST(1000, "올바르지 않은 요청입니다."),

    SESSION_CREATION_FAILED(2001, "세션 생성에 실패했습니다."),
    CONNECTION_CREATION_FAILED(2002, "연결 생성에 실패했습니다."),
    SESSION_NOT_FOUND(2003, "세션을 찾을 수 없습니다."),

    DATA_NOT_FOUND(3000, "데이터를 찾을 수 없습니다."),
    WORD_NOT_FOUND(3404, "단어를 찾을 수 없습니다."),

    SERVER_ERROR(9000, "서버 에러가 발생하였습니다.");

    private final int code;
    private final String message;
}
