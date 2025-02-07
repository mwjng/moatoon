package com._2.a401.moa.word.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyWordExample {
    private long id;
    private String word;
    private String meaning;
    private int failCount;
    private String example;
}
