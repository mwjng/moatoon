package com._2.a401.moa.auth.service;

import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisMailSevice {
    private final RedisTemplate<String, Object> redisTemplate;

    //email을 key값 code를 value로 하여 3분동안 저장한다.
    public void setCode(String email,String code){
        ValueOperations<String, Object> valOperations = redisTemplate.opsForValue();
        //만료기간 3분
        valOperations.set(email,code,180, TimeUnit.SECONDS);
    }

    //key값인 email에 있는 value를 가져온다.
    public String getCode(String email){
        ValueOperations<String, Object> valOperations = redisTemplate.opsForValue();
        Object code = valOperations.get(email);
        if(code == null){
            throw new MoaException(ExceptionCode.SERVER_ERROR);
        }
        return code.toString();
    }
}
