package com._2.a401.moa.auth.service;

import com._2.a401.moa.auth.dto.AuthToken;
import com._2.a401.moa.auth.dto.LoginInfo;
import com._2.a401.moa.auth.exception.AuthException;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static com._2.a401.moa.common.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final AuthenticationManager authenticationManager;
    private final RedisRefreshTokenService redisRefreshTokenService;
    private final RedisMailSevice redisMailSevice;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void checkEmailDup(String email) {
        if(memberRepository.findByEmail(email).isPresent()) {
            throw new AuthException(DUPLICATED_EMAIL);
        }
    }

    @Transactional
    public AuthToken login(final LoginInfo loginInfo) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginInfo.getLoginId(), loginInfo.getPassword())
        );
        final Member member = memberRepository
                .findByLoginId(loginInfo.getLoginId())
                .orElseThrow(() -> new AuthException(INVALID_USER_ID));

        final AuthToken authToken = jwtUtil.createAccessAndRefreshToken(authentication);
        redisRefreshTokenService.save(loginInfo.getLoginId(), authToken.getRefreshToken());
        return authToken;

    }

    public void checkLoginId(String loginId) {
        if (memberRepository.existsByLoginId(loginId)) {
            throw new AuthException(DUPLICATED_USER_ID);
        }
    }

    public void checkCode(String email, String code) {
        if(!code.equals(redisMailSevice.getCode(email))){
            throw new AuthException(INVALID_CODE);
        }
    }
}
