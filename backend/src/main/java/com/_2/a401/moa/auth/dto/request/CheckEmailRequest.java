package com._2.a401.moa.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CheckEmailRequest(
        @NotBlank(message = "이메일은 필수값입니다.")
        String email
) {
}
