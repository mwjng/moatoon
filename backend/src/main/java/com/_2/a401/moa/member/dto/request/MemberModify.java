package com._2.a401.moa.member.dto.request;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberRole;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static com._2.a401.moa.member.domain.MemberRole.CHILD;

@Getter
public class MemberModify {

    String password;

    @NotBlank(message = "닉네임을 입력해주세요.")
    @Size( max = 20, message = "닉네임은 20자 이하여야 합니다.")
    String nickname;

    String imgUrl;

    List<Long> children;





}
