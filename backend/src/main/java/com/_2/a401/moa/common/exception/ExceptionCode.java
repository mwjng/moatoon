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
    SESSION_CAPACITY_EXCEEDED(2004, "세션에 인원이 모두 찼습니다"),
    SESSION_MEMBER_NOT_FOUND(2005, "회원이 세션에 참여하고 있지 않습니다."),

    DATA_NOT_FOUND(3000, "데이터를 찾을 수 없습니다."),
    WORD_NOT_FOUND(3404, "단어를 찾을 수 없습니다."),

    INVALID_AUTHORITY(4001,  "해당 리소스에 접근할 권한이 없습니다."),
    INVALID_USER_ID(4002,  "아이디가 존재하지 않습니다."),
    INVALID_PASSWORD(4003,  "비밀번호가 일치하지 않습니다."),
    INVALID_TOKEN(4004,  "유효하지 않은 토큰 입니다."),
    UNSUPPORT_TOKEN(4005,  "지원하지 않는 토큰 입니다."),
    INVALID_AUTHORIZATION_CODE(4006, "유효하지 않은 인가 코드 입니다."),
    INVALID_OAUTH_PROVIDER(4007,  "지원하지 않는 OAuth 제공자 입니다."),
    EXPIRED_ACCESS_TOKEN(4008,  "만료된 AccessToken 입니다."),
    EXPIRED_REFRESH_TOKEN(4009,  "만료된 RefreshToken 입니다."),
    INVALID_MEMBER_ROLE(4010,  "유효하지 않은 권한 정보 입니다."),
    FAIL_OAUTH_USERINFO_RETRIEVAL(4011,  "회원 정보를 가져오는데 실패했습니다."),
    INVALID_MEMBER_STATUS(4012, "유효하지 않은 회원 상태입니다."),
    INVALID_MEMBER(4013, "존재하지 않는 회원입니다."),
    DUPLICATED_USER_ID(4014, "중복된 아이디입니다."),
    DUPLICATED_EMAIL(4015, "중복된 이메일입니다."),
    INVALID_CODE(4016, "잘못된 인증번호입니다."),
    DUPLICATED_CHILD(4017, "이미 등록/삭제된 아동입니다."),
    UNCONNECTED_CHILD(4018, "보호자가 등록되지 않은 아동입니다."),
    INVALID_MANAGER(4019, "부모 정보를 찾을 수 없습니다."),
    INVALID_PARTY(4020, "모임 정보를 찾을 수 없습니다."),
    PARTY_FULL(4021, "이미 인원이 찼습니다"),
    NO_INFO(4022, "필요한 정보가 입력되어있지 않습니다"),

    INVALID_CHILD(4023, "아이 정보를 찾을 수 없습니다."),
    SCHEDULE_NOT_FOUND(5001, "스케줄을 찾을 수 없습니다."),
    SCHEDULE_NOT_ACTIVE(5002, "스케줄이 진행 중인 상태가 아닙니다"),

    INVALID_AUDIO_TYPE(6001, "올바르지 않은 오디오를 요청하였습니다."),

    SERVER_ERROR(9000, "서버 에러가 발생하였습니다.");

    private final int code;
    private final String message;
}
