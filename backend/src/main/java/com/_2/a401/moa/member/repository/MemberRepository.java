package com._2.a401.moa.member.repository;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByLoginId(String loginId);

    List<Member> findByManagerId(Long managerId);

    Optional<Member> findByLoginId(String loginId);

    List<Member> findByManager(Member manager);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByLoginIdAndEmail(String loginId, String email);
    // memberId가 managerId의 자녀인지 확인하는 메서드
    boolean existsByIdAndManagerId(Long memberId, Long managerId);

    Optional<Member> findByEmailAndName(String email, String name);

    Optional<Member> findById(long id);

    List<Member> findByManagerIdAndStatus(long memberId, MemberState memberState);

    Optional<Member> findByIdAndStatus(Long childId, MemberState memberState);

    Optional<Member> findByLoginIdAndStatus(String loginId, MemberState memberState);

    Optional<Member> findByEmailAndStatus(String email, MemberState memberState);
}
