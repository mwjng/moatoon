package com._2.a401.moa.word.controller;

import com._2.a401.moa.word.dto.LearningWordsResponse;
import com._2.a401.moa.word.dto.QuizResponse;
import com._2.a401.moa.word.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WordController {
    private final WordService wordService;

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
}
