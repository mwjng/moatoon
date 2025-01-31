package com._2.a401.moa.common.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public enum ExceptionCode {

    INVALID_REQUEST(1000, "올바르지 않은 요청입니다."),

    SERVER_ERROR(4000, "서버 에러가 발생하였습니다.");

    private final int code;
    private final String message;
}
