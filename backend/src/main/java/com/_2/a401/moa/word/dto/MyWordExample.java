package com._2.a401.moa.word.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@AllArgsConstructor
@ToString
public class MyWordExample {
    private long id;
    private String word;
    private String meaning;
    private int failCount;
    private String example;
}
