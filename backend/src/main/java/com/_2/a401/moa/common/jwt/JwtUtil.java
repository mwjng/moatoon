package com._2.a401.moa.common.jwt;

import com._2.a401.moa.auth.dto.AuthToken;
import com._2.a401.moa.auth.dto.MemberDetails;
import com._2.a401.moa.auth.exception.ExpiredTokenException;
import com._2.a401.moa.auth.exception.InvalidTokenException;
import com._2.a401.moa.auth.service.RedisRefreshTokenService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static com._2.a401.moa.common.exception.ExceptionCode.*;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_TYPE = "Bearer";

    private final RedisRefreshTokenService redisRefreshTokenService;

    @Value("${spring.jwt.secret}")
    private String secretKey;
    private SecretKey key;

    @Value("${spring.jwt.token.access-expiration-time}")
    private long accessExpirationTime;

    @Value("${spring.jwt.token.refresh-expiration-time}")
    private long refreshExpirationTime;

    @PostConstruct
    private void init() {
        this.key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public AuthToken createAccessAndRefreshToken(Authentication authentication){
        return new AuthToken(createAccessToken(authentication),
                createRefreshToken(authentication));

    }

    public String createAccessToken(Authentication authentication){
        return generateToken(authentication, accessExpirationTime);
    }

    public String createRefreshToken(Authentication authentication){
        return generateToken(authentication, refreshExpirationTime);
    }

    private String generateToken(final Authentication authentication, final Long expirationTime) {
        MemberDetails memberDetails = (MemberDetails) authentication.getPrincipal();

        String loginId = memberDetails.getUsername();
        Long memberId = memberDetails.getMember().getId();
        String nickname = memberDetails.getMember().getNickname();
        final Date now = new Date();
        final Date expireDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(loginId)
                .claim("memberId", memberId)
                .claim("nickname", nickname)
                .issuedAt(now)
                .expiration(expireDate)
                .signWith(key)
                .compact();
    }

    public Jws<Claims> getClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
    }


    // 토큰 검증
    public void validateToken(String token) {
        try {
            getClaims(token);
        } catch (ExpiredJwtException e) {
            throw new ExpiredTokenException(EXPIRED_ACCESS_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new InvalidTokenException(UNSUPPORT_TOKEN);
        } catch (IllegalArgumentException | JwtException e) {
            throw new InvalidTokenException(INVALID_TOKEN);
        }
    }

    // 토큰에서 사용자 정보 가져오기
    public Claims getUserInfoFromToken(String token) {
        try {
            return getClaims(token).getPayload();
        } catch (JwtException e) {
            throw new InvalidTokenException(INVALID_TOKEN);
        }
    }

    public long getMemberId(String token) {
        if (token == null || token.isEmpty()) {
            System.out.println("토큰이 없습니다!");
            return 0;
        }else{
            System.out.println(token);
        }
        Claims payload = getClaims(token).getPayload();
        return payload.get("memberId", Long.class);
    }


    // HttpServletRequest에서 헤더에 있는 JWT Access Token 가져오기
    public String getTokenFromRequest(HttpServletRequest req) {
        String token = req.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(token) && token.startsWith(BEARER_TYPE)) {
            return token.substring(7);
        }
        return null;
    }

    public void logout(String loginId) {
        redisRefreshTokenService.delete(loginId);
    }


}
