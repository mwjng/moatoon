package com._2.a401.moa.word.controller;

//import com._2.a401.moa.utils.JwtUtil;
import com._2.a401.moa.common.jwt.JwtUtil;
import com._2.a401.moa.word.dto.response.LearningWordsResponse;
import com._2.a401.moa.word.dto.response.MyWordsResponse;
import com._2.a401.moa.word.dto.response.QuizResponse;
import com._2.a401.moa.word.dto.response.RandomWordsResponse;
import com._2.a401.moa.word.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class WordController {
    private final WordService wordService;
    private final JwtUtil jwtUtil;

    @PostMapping("/words/saved-words")
    public ResponseEntity<Object> addMyWords(@RequestHeader("Authorization") String token, @RequestParam("wordId") long wordId) {
        long memberId = jwtUtil.getMemberId(token);
        wordService.addMyWords(memberId, wordId);
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
    public ResponseEntity<MyWordsResponse> getMyWords(@RequestHeader("Authorization") String token, @RequestParam("page") int page) {
        long memberId = jwtUtil.getMemberId(token);
        return ResponseEntity.ok(wordService.getMyWords(memberId, page));
    }

    @GetMapping("/words/random")
    public ResponseEntity<RandomWordsResponse> getRandomWords(
            @RequestParam("level") int level,
            @RequestParam("episodeCount") int episodeCount) {
        return ResponseEntity.ok(wordService.getRandomWords(level, episodeCount));
    }
}
