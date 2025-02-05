package com._2.a401.moa.word.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class WordWithExamples {
    private long wordId;
    private String word;
    private List<String> examples;
}
