package com._2.a401.moa.word.controller;

import com._2.a401.moa.word.dto.quizResponse;
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
    public ResponseEntity<quizResponse> getQuiz(@PathVariable Long partyId) {
        quizResponse response = wordService.generateQuiz(partyId);
        return ResponseEntity.ok(response);
    }
}
