package com._2.a401.moa.member.repository;

import com._2.a401.moa.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
