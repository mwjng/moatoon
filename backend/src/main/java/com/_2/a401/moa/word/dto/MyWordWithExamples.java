package com._2.a401.moa.word.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MyWordWithExamples {
    private long id;
    private String word;
    private String meaning;
    private int failCount;
    private List<String> examples;
}
