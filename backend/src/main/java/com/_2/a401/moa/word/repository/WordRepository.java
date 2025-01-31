package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.domain.Word;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordRepository extends JpaRepository<Word, Long> {
}
