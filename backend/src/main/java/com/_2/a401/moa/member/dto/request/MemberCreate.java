package com._2.a401.moa.member.dto.request;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Getter
public class MemberCreate {

    @NotBlank(message = "아이디를 입력해주세요.")
    @Size(max = 20, message = "아이디는 20자 이하여야 합니다.")
    String loginId;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Pattern(
            regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,20}$",
            message = "비밀번호는 8~20자의 대소문자, 숫자, 특수문자를 포함해야 합니다."
    )
    String password;

    @Size(min = 2, max = 10, message = "이름은 2자 이상 10자 이하여야 합니다.")
    String name;

    @NotBlank(message = "닉네임을 입력해주세요.")
    @Size( max = 20, message = "닉네임은 20자 이하여야 합니다.")
    String nickname;

    @Pattern(regexp = "^$|^[A-Za-z0-9+_.-]+@(.+)$", message = "이메일 형식이 올바르지 않습니다.")
    String email;

    String imgUrl;

    MemberRole role;

    List<Long> children;

    public Member toMember(PasswordEncoder encoder) {
        return Member.builder()
                .nickname(nickname)
                .name(name)
                .loginId(loginId)
                .password(encoder.encode(password))
                .role(role)
                .build();
    }

}
