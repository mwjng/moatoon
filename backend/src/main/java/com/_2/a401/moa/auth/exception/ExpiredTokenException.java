package com._2.a401.moa.auth.exception;

import com._2.a401.moa.common.exception.ExceptionCode;

public class ExpiredTokenException extends AuthException {

    public ExpiredTokenException(final ExceptionCode errorCode) {
        super(errorCode);
    }
}
