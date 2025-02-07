package com._2.a401.moa.word.dto.response;

import com._2.a401.moa.word.dto.WordWithExamples;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class LearningWordsResponse {
    List<WordWithExamples> words;
}
