package com._2.a401.moa.common.exception;

import lombok.Getter;

@Getter
public class MoaException extends RuntimeException {

    private final int code;

    public MoaException(final ExceptionCode exceptionCode) {
        super(exceptionCode.getMessage());
        this.code = exceptionCode.getCode();
    }
}
