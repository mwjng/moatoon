package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PartyMemberRepository extends JpaRepository<PartyMember, Long> {

    @Query(value = "SELECT member_id FROM party_member WHERE party_id = :partyId", nativeQuery = true)
    List<Long> findMemberIdsByPartyId(@Param("partyId") Long partyId);
}
