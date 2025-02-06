package com._2.a401.moa.cut.service;

import com._2.a401.moa.cut.dto.request.CanvasCacheDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class CutService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_PREFIX = "canvas:";   //canvas라는 것을 표시

    public void saveTempCanvasData(CanvasCacheDto canvasCacheDto) {
        try {
            //현재 시간으로 업데이트
            CanvasCacheDto updatedCanvasCacheDto=canvasCacheDto.toBuilder()
                    .timestamp(LocalDateTime.now())
                    .build();

            String key = CACHE_PREFIX + canvasCacheDto.getCutId();

            //객체를 JSON 문자열로 변환
            String value = objectMapper.writeValueAsString(updatedCanvasCacheDto);
            redisTemplate.opsForValue().set(key, value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 변환 실패", e);
        }
    }
}
