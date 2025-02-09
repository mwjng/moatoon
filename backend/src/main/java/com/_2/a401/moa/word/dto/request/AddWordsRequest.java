package com._2.a401.moa.word.dto.request;

import lombok.Getter;

import java.util.List;

@Getter
public class AddWordsRequest {
    List<Long> wordIds;
}
