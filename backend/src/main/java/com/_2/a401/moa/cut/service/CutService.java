package com._2.a401.moa.cut.service;

import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.common.s3.S3Service;
import com._2.a401.moa.cut.domain.Cut;
import com._2.a401.moa.cut.dto.request.CanvasRedisRequest;
import com._2.a401.moa.cut.dto.response.CanvasRedisResponse;
import com._2.a401.moa.cut.dto.response.CutInfoResponse;
import com._2.a401.moa.cut.dto.response.PictureResponse;
import com._2.a401.moa.cut.repository.CutRepository;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.schedule.dto.response.ScheduleInfoResponse;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.word.domain.Word;
import com._2.a401.moa.word.repository.WordRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RequiredArgsConstructor
@Service
public class CutService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_PREFIX = "canvas:";   //canvas라는 것을 표시
    private final S3Service s3Service;
    private final CutRepository cutRepository;
    private final ScheduleRepository scheduleRepository;
    private final WordRepository wordRepository;

    public void saveTempCanvasData(CanvasRedisRequest canvasRedisRequest) {
        try {
            //현재 시간으로 업데이트
            CanvasRedisRequest updatedCanvasRedisRequest=canvasRedisRequest.toBuilder()
                    .timestamp(LocalDateTime.now())
                    .build();

            String key = CACHE_PREFIX + canvasRedisRequest.getCutId();

            //객체를 JSON 문자열로 변환
            String value = objectMapper.writeValueAsString(updatedCanvasRedisRequest);
            redisTemplate.opsForValue().set(key, value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 변환 실패", e);
        }
    }

    public CanvasRedisResponse getTempCanvasData(Long cutId){
        String key = CACHE_PREFIX + cutId;

        // Redis에서 데이터 조회
        String value = (String) redisTemplate.opsForValue().get(key);

        // 데이터가 없는데 조회할 경우
        if (value == null) {
            throw new MoaException(ExceptionCode.DATA_NOT_FOUND);
        }

        try {
            // JSON 문자열을 객체로 변환
            return objectMapper.readValue(value, CanvasRedisResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 파싱 실패", e);
        }
    }

    @Transactional
    public String savePicture(Long cutId, MultipartFile file) {
        String cutFileUrl = s3Service.upload(file);

        cutRepository.savePictureByCutId(cutFileUrl, cutId);

        return cutFileUrl;
    }

    public List<PictureResponse> getPictureData(Long scheduleId) {
        ScheduleInfoResponse scheduleInfo = scheduleRepository.getScheduleInfo(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + scheduleId));;

        int startRange = scheduleInfo.getEpisodeNumber() * 4 - 3;
        int endRange = scheduleInfo.getEpisodeNumber() * 4;

        List<Cut> cuts=cutRepository.getCutsByRange(scheduleInfo.getPartyId(), startRange, endRange);

        return cuts.stream()
                .map(cut -> PictureResponse.builder()
                        .id(cut.getId())
                        .cutOrder(cut.getCutOrder())
                        .content(cut.getContent())
                        .imageUrl(cut.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }


    @Transactional
    public List<Cut> createCuts(Party party, CreatePartyRequest request) {
        List<Cut> cuts = new ArrayList<>();
        int cutOrder = 1;

        for (CreatePartyRequest.ChapterRequest chapter : request.getStory().getChapters()) {
            List<Integer> randomOrderList = generateUniqueRandomNumbers(1, 4, 4);

            for (int i = 0; i < chapter.getSentences().size(); i++) {
                Cut cut = Cut.builder()
                        .party(party)
                        .word(wordRepository.findById(chapter.getWords().get(i).getId())
                                .orElseThrow(() -> new EntityNotFoundException("Word not found")))
                        .content(chapter.getSentences().get(i))
                        .cutOrder(cutOrder++)
                        .randomOrder(randomOrderList.get(i))
                        .build();
                cuts.add(cut);
            }
        }
        return cutRepository.saveAll(cuts);
    }


    private List<Integer> generateUniqueRandomNumbers(int min, int max, int size) {
        List<Integer> numbers = IntStream.rangeClosed(min, max).boxed().collect(Collectors.toList());
        Collections.shuffle(numbers);
        return numbers.subList(0, size);
    }

    public void initializeCanvasData(@Valid List<Long> cutIds) {
        try {
            for (Long cutId : cutIds) {
                String key = CACHE_PREFIX + cutId;

                // Redis에 데이터가 없을 때만 기본 데이터 삽입
                if (redisTemplate.opsForValue().get(key) == null) {
                    CanvasRedisRequest defaultRequest=CanvasRedisRequest.builder()
                            .cutId(cutId)
                            .canvasData("[]")
                            .timestamp(LocalDateTime.now())
                            .build();

                    String jsonData = objectMapper.writeValueAsString(defaultRequest);
                    redisTemplate.opsForValue().set(key, jsonData);
                    //System.out.println("초기 데이터 삽입: " + key);
                }
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Redis 초기 데이터 설정 실패", e);
        }
    }

    public List<CutInfoResponse> getCutsInfo(Long scheduleId) {
        ScheduleInfoResponse scheduleInfo = scheduleRepository.getScheduleInfo(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + scheduleId));;

        int startRange = scheduleInfo.getEpisodeNumber() * 4 - 3;
        int endRange = scheduleInfo.getEpisodeNumber() * 4;

        List<CutInfoResponse> cuts=cutRepository.getCutsAndMemberByRange(scheduleInfo.getPartyId(), startRange, endRange);

        return cuts;
    }
}
