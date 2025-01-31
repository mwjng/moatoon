package com._2.a401.moa.common.exception;

public record ExceptionResponse(int code, String message) {

    public ExceptionResponse(final ExceptionCode exceptionCode) {
        this(exceptionCode.getCode(), exceptionCode.getMessage());
    }

    public ExceptionResponse(final ExceptionCode exceptionCode, final String message) {
        this(exceptionCode.getCode(), message);
    }
}
