package com._2.a401.moa.auth.exception;

import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import lombok.Getter;

@Getter
public class AuthException extends MoaException {

    public AuthException(final ExceptionCode errorCode) {
        super(errorCode);
    }
}
