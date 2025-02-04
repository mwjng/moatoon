package com._2.a401.moa.word.dto;

import com._2.a401.moa.word.domain.Word;
import com._2.a401.moa.word.domain.WordExample;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class quizResponse {
    private List<WordExample> wordExamples;
    private List<Word> randomWords;
}
