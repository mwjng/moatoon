package com._2.a401.moa.word.dto.response;

import com._2.a401.moa.word.dto.QuizWord;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RandomWordsResponse {

    List<QuizWord> words;
}
