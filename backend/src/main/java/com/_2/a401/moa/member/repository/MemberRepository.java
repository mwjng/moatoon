package com._2.a401.moa.member.repository;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberState;
import com._2.a401.moa.party.domain.Party;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.manager WHERE m.id = :id")
    Optional<Member> findByIdWithManager(@Param("id") Long id); // 매니저 정보와 함께 멤버 정보 조회

    @Query("SELECT m FROM Member m WHERE m.manager.id = :managerId AND m.status = 'ACTIVE'")
    List<Member> findAllByManagerId(Long managerId);  // 매니저의 아동 목록 조회

    boolean existsByLoginId(String loginId);

    Optional<Member> findByLoginId(String loginId);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByLoginIdAndEmail(String loginId, String email);

    // memberId가 managerId의 자녀인지 확인하는 메서드
    boolean existsByIdAndManagerIdAndStatus(Long memberId, Long managerId, MemberState status);

    Optional<Member> findByEmailAndName(String email, String name);

    Optional<Member> findById(long id);

    List<Member> findByManagerIdAndStatus(long memberId, MemberState memberState);

    Optional<Member> findByIdAndStatus(Long childId, MemberState memberState);

    Optional<Member> findByLoginIdAndStatus(String loginId, MemberState memberState);

    Optional<Member> findByEmailAndStatus(String email, MemberState memberState);

    @Query(value = "select count(1) from schedule where party_id=:partyId and session_time " +
            "in (select session_time from schedule where party_id " +
            "in (select party_id from party p inner join party_member pm on pm.party_id = p.id where p.status != 'DONE' and pm.member_id=:childId))", nativeQuery = true)
    int checkCanJoinParty(Long partyId, Long childId);

    @Query(value = "select count(1) from schedule where session_time = :sessionTime and party_id " +
            "in (select party_id from party p inner join party_member pm on pm.party_id = p.id where p.status != 'DONE' and pm.member_id=:id)", nativeQuery = true)
    int checkCanJoin(LocalDateTime sessionTime, Long id);
}
