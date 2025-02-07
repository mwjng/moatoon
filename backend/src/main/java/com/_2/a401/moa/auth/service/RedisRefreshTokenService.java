package com._2.a401.moa.auth.service;

import com._2.a401.moa.auth.exception.InvalidTokenException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static com._2.a401.moa.common.exception.ExceptionCode.INVALID_TOKEN;

@Service
@RequiredArgsConstructor
public class RedisRefreshTokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    // 리프레쉬 토큰 만료시간
    @Value("${spring.jwt.token.refresh-expiration-time}")
    private int refreshExpirationTime;

    public void save(String username, String refreshToken) {
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        valueOperations.set(username, refreshToken, refreshExpirationTime, TimeUnit.MILLISECONDS);
    }

    public void delete(String username) {
        redisTemplate.delete(username);
    }

    public String findByUsername(final String username) {
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        String refreshToken = Objects.toString(valueOperations.get(username), null);

        if (refreshToken == null) {
            throw new InvalidTokenException(INVALID_TOKEN);
        }

        return refreshToken;
    }


}
