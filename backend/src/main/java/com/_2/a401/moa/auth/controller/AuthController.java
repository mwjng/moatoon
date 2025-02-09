package com._2.a401.moa.auth.controller;

import com._2.a401.moa.auth.dto.AuthToken;
import com._2.a401.moa.auth.dto.LoginInfo;
import com._2.a401.moa.auth.exception.InvalidTokenException;
import com._2.a401.moa.auth.service.AuthService;
import com._2.a401.moa.auth.service.MailService;
import com._2.a401.moa.auth.service.RedisRefreshTokenService;
import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RedisRefreshTokenService redisRefreshTokenService;
    @Value("${spring.jwt.token.refresh-expiration-time}")
    private int refreshExpirationTime;

    @GetMapping("/id/check?loginId={loginId}")
    public ResponseEntity<String> checkLoginId(@RequestParam String loginId){
        authService.checkLoginId(loginId);
        return new ResponseEntity<>("사용가능 한 아이디", HttpStatus.OK);


    }

    @PostMapping("/email/check")
    public ResponseEntity<String> checkEmailInRegist(@RequestBody Map<String, String> request){
        String email = request.get("email").trim();
        authService.checkEmailDup(email);

        if(mailService.sendCodeMail(email)){
            return new ResponseEntity<>("이메일 코드 전송 성공", HttpStatus.OK);
        }
        return new ResponseEntity<>("이메일 코드 전송 실패", HttpStatus.INTERNAL_SERVER_ERROR);
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
