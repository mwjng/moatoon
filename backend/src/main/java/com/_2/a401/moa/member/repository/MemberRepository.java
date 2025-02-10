package com._2.a401.moa.member.repository;

import com._2.a401.moa.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByManagerId(Long managerId);

    Optional<Member> findByLoginId(String loginId);

    List<Member> findByManager(Member manager);

    Optional<Object> findByEmail(String email);

    // memberId가 managerId의 자녀인지 확인하는 메서드
    boolean existsByIdAndManagerId(Long memberId, Long managerId);
}
