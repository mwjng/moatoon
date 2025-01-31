package com._2.a401.moa.word.repository;

import com._2.a401.moa.word.domain.MyWord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MyWordRepository extends JpaRepository<MyWord, Long> {
}
