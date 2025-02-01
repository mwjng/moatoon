package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartyMemberRepository extends JpaRepository<PartyMember, Long> {
}
