package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;

public interface PartyKeywordRepository extends JpaRepository<PartyKeyword, Long> {
    @Query("SELECT pk FROM PartyKeyword pk JOIN FETCH pk.keyword WHERE pk.party.id = :partyId")
    List<PartyKeyword> findByParty(@Param("partyId") Long partyId);
}

