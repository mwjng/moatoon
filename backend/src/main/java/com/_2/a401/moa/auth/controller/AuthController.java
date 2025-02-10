package com._2.a401.moa.auth.controller;

import com._2.a401.moa.auth.dto.AuthToken;
import com._2.a401.moa.auth.dto.LoginInfo;
import com._2.a401.moa.auth.dto.request.CheckEmailRequest;
import com._2.a401.moa.auth.exception.InvalidTokenException;
import com._2.a401.moa.auth.service.AuthService;
import com._2.a401.moa.auth.service.MailService;
import com._2.a401.moa.auth.service.RedisRefreshTokenService;
import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import static java.time.LocalDateTime.now;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RedisRefreshTokenService redisRefreshTokenService;
    @Value("${spring.jwt.token.refresh-expiration-time}")
    private int refreshExpirationTime;

    @GetMapping("/id/check/{loginId}")
    public ResponseEntity<Void> checkLoginId(@PathVariable("loginId") String loginId) {
        authService.checkLoginId(loginId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email/check")
    public ResponseEntity<Void> checkEmailInRegist(@RequestBody @Valid CheckEmailRequest request){
        authService.checkEmailDup(request.email());
        mailService.sendCodeMail(request.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email/code")
    public ResponseEntity<String> checkEmailCode(@RequestBody Map<String, String> req){
        String code = req.get("code");
        String email = req.get("email");
        authService.checkCode(email, code);
        return new ResponseEntity<>("인증 성공", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginInfo loginInfo, HttpServletResponse response) {

        final AuthToken authToken = authService.login(loginInfo);


        redisRefreshTokenService.save(loginInfo.getLoginId(), authToken.getRefreshToken());

        Cookie refreshTokenCookie = new Cookie("refreshToken", authToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/"); // 모든 경로에서 접근 가능
        refreshTokenCookie.setMaxAge(refreshExpirationTime); // 7일 동안 유지
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok(Map.of("accessToken", authToken.getAccessToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@CookieValue("refreshToken") final String refreshToken) {
        jwtUtil.validateToken(refreshToken);

        String username = jwtUtil.getUserInfoFromToken(refreshToken).getSubject();

        String savedRefreshToken = redisRefreshTokenService.findByUsername(username);

        if (savedRefreshToken.isEmpty() || !savedRefreshToken.equals(refreshToken)) {
            throw new InvalidTokenException(ExceptionCode.INVALID_TOKEN);
        }

        String newAccessToken = jwtUtil.createAccessToken(
                new UsernamePasswordAuthenticationToken(username, null, null)
        );

        return ResponseEntity.ok(Map.of("accessToken",newAccessToken));
    }
}
