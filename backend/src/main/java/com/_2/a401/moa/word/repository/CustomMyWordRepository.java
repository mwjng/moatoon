package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.dto.MyWordExample;

import java.util.List;

public interface CustomMyWordRepository {
    List<MyWordExample> findWithWordIdAndPage(Long memberId, int page, String keyword);

    Long countAll(Long memberId, String keyword);
}
