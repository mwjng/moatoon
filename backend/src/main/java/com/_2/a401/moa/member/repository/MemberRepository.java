package com._2.a401.moa.member.repository;

import com._2.a401.moa.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByManagerId(Long managerId);
}
