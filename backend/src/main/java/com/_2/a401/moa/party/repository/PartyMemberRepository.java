package com._2.a401.moa.party.repository;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PartyMemberRepository extends JpaRepository<PartyMember, Long> {

    @Query(value = "SELECT member_id FROM party_member WHERE party_id = :partyId", nativeQuery = true)
    List<Long> findMemberIdsByPartyId(@Param("partyId") Long partyId);

    Optional<PartyMember> findByPartyAndMember(Party party, Member child);

    @Query("SELECT COUNT(pm) FROM PartyMember pm WHERE pm.party = :party")
    int countByParty(@Param("party") Party party);

    boolean existsByPartyAndMember(Party party, Member member);

    void deleteByPartyAndMember(Party party, Member member);
}
