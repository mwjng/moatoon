package com._2.a401.moa.word.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuizSentence {
    private String front;
    private String back;
    private String word;
    private Long wordId;
}
