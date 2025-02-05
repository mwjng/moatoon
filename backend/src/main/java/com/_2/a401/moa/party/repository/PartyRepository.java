package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PartyRepository extends JpaRepository<Party, Long>, CustomPartyRepository {
    Optional<Party> findById(Long partyId);
}
