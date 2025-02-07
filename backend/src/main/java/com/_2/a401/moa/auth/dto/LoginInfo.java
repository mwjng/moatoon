package com._2.a401.moa.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginInfo {
    private String loginId;
    private String password;
}
