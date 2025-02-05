package com._2.a401.moa.word.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuizWord {
    private Long wordId;
    private String word;
}
