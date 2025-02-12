package com._2.a401.moa.word.controller;

import com._2.a401.moa.word.dto.request.WordIdRequest;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.word.dto.request.AddWordsRequest;
import com._2.a401.moa.word.dto.response.LearningWordsResponse;
import com._2.a401.moa.word.dto.response.MyWordsResponse;
import com._2.a401.moa.word.dto.response.QuizResponse;
import com._2.a401.moa.word.dto.response.RandomWordsResponse;
import com._2.a401.moa.word.service.WordService;
import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class WordController {
    private final WordService wordService;
    private final JwtUtil jwtUtil;


    @DeleteMapping("/words/saved-words")
    public ResponseEntity<Object> removeMyWords(HttpServletRequest request, @RequestBody WordIdRequest wordIdRequest) {
        String token = jwtUtil.getTokenFromRequest(request);
        long memberId = jwtUtil.getMemberId(token);
        wordService.removeWord(memberId, wordIdRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/words/saved-words")
    public ResponseEntity<Object> addMyWords(HttpServletRequest request, @RequestBody AddWordsRequest addWordsRequest) {
        String token = jwtUtil.getTokenFromRequest(request);
        long memberId = jwtUtil.getMemberId(token);
        wordService.addMyWords(memberId, addWordsRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/parties/{partyId}/quiz")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Long partyId) {
        QuizResponse response = wordService.generateQuiz(partyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/words/{partyId}")
    public ResponseEntity<LearningWordsResponse> getLearningWords(@PathVariable Long partyId) {
        LearningWordsResponse response = wordService.getLearningWords(partyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/words/saved-words")
    public ResponseEntity<MyWordsResponse> getMyWords(HttpServletRequest request,
                                                      @Nullable @RequestParam("page") Integer page,
                                                      @Nullable @RequestParam("keyword") String keyword) {
        String token = jwtUtil.getTokenFromRequest(request);
        long memberId = jwtUtil.getMemberId(token);
        return ResponseEntity.ok(wordService.getMyWords(memberId, page, keyword));
    }

    @GetMapping("/words/random")
    public ResponseEntity<RandomWordsResponse> getRandomWords(
            @RequestParam("level") int level,
            @RequestParam("episodeCount") int episodeCount) {
        return ResponseEntity.ok(wordService.getRandomWords(level, episodeCount));
    }
}
