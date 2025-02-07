package com._2.a401.moa.utils;

import com._2.a401.moa.member.domain.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    @Value("${jwt.access-token-expiration}")
    private Long accessExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshExpiration;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
    }

//    public String createAccessToken(Member member) {
//        return Jwts.builder()
//                .claim("memberId", member.getId())
//                .issuedAt(new Date(System.currentTimeMillis()))
//                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
//                .signWith(secretKey)
//                .compact();
//    }
//
//    public String createRefreshToken(Member member) {
//        return Jwts.builder()
//                .claim("memberId", member.getId())
//                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
//                .signWith(secretKey)
//                .compact();
//    }

    public long getMemberId(String token) {
        Claims payload = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return payload.get("memberId", Long.class);
    }

//    public boolean isValidRefreshToken(String refreshToken) {
//        try {
//            getClaimsToken(refreshToken);
//            return true;
//        } catch (NullPointerException | JwtException e) {
//            return false;
//        }
//    }
//
//    private Claims getClaimsToken(String token) {
//        return Jwts.parser()
//                .verifyWith(secretKey)
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }

}
