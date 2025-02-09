package com._2.a401.moa.member.repository;

import com._2.a401.moa.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByManagerId(Long managerId);

    Optional<Member> findByLoginId(String loginId);

    List<Member> findByManager(Member manager);
<<<<<<< HEAD

    Optional<Object> findByEmail(String email);
=======
>>>>>>> 0857f5e9c66554ef06612c40bb4ad333ac0c205a
}
