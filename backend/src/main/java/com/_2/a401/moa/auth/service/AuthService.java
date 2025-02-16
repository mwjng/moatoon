package com._2.a401.moa.auth.service;

import com._2.a401.moa.auth.dto.AuthToken;
import com._2.a401.moa.auth.dto.LoginInfo;
import com._2.a401.moa.auth.exception.AuthException;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberState;
import com._2.a401.moa.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.http.HttpRequest;
import java.time.LocalDateTime;
import java.util.Optional;

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
        if(memberRepository.findByEmailAndStatus(email, MemberState.ACTIVE).isPresent()) {
            throw new MoaException(DUPLICATED_EMAIL);
        }
    }

    @Transactional
    public AuthToken login(final LoginInfo loginInfo) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginInfo.getLoginId(), loginInfo.getPassword())
        );
        final Member member = memberRepository
                .findByLoginId(loginInfo.getLoginId())
                .orElseThrow(() -> new MoaException(INVALID_USER_ID));

        if(!member.getStatus().equals(MemberState.ACTIVE)){
            throw new MoaException(INVALID_MEMBER_STATUS);
        }

        final AuthToken authToken = jwtUtil.createAccessAndRefreshToken(authentication);
        redisRefreshTokenService.save(loginInfo.getLoginId(), authToken.getRefreshToken());
        return authToken;

    }

    public void checkLoginId(String loginId) {
        if (memberRepository.existsByLoginId(loginId)) {
            throw new MoaException(DUPLICATED_USER_ID);
        }
    }

    public void checkCode(String email, String code) {
        if(!code.equals(redisMailSevice.getCode(email))){
            throw new MoaException(INVALID_CODE);
        }
    }

    public void checkPassword(String password, HttpServletRequest req) {
        long id = jwtUtil.getMemberId(jwtUtil.getTokenFromRequest(req));
        Member member = memberRepository.findById(id).orElseThrow(() -> new MoaException(INVALID_USER_ID));

        System.out.println("입력 비밀번호: " + password);
        System.out.println("DB 저장 비밀번호: " + member.getPassword());
        System.out.println("비밀번호 일치 여부: " + passwordEncoder.matches(password, member.getPassword()));


        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new MoaException(INVALID_PASSWORD);
        }
    }

    public void logout(HttpServletRequest req) {
        String loginId = jwtUtil.getUserInfoFromToken(jwtUtil.getTokenFromRequest(req)).getSubject();
        jwtUtil.logout(loginId);
    }
}
