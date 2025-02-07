package com._2.a401.moa.auth.exception;

import com._2.a401.moa.common.exception.ExceptionCode;

public class InvalidTokenException extends AuthException {

    public InvalidTokenException(final ExceptionCode errorCode) {
        super(errorCode);
    }
}
