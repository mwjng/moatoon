package com._2.a401.moa.auth.exception;

import com._2.a401.moa.common.exception.ExceptionCode;
import lombok.Getter;

@Getter
public class AuthException extends RuntimeException {

    private final ExceptionCode errorCode;

    public AuthException(final ExceptionCode errorCode) {
        this.errorCode = errorCode;
    }
}
