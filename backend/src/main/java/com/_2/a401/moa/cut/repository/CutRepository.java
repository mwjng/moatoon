package com._2.a401.moa.cut.repository;

import com._2.a401.moa.cut.domain.Cut;
import com._2.a401.moa.party.domain.Party;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CutRepository extends JpaRepository<Cut, Long> {

    @Modifying
    @Query(value = "UPDATE Cut c SET c.image_url=:cutFileUrl WHERE c.id=:cutId"
    , nativeQuery = true)
    void savePictureByCutId(String cutFileUrl, Long cutId);

    @Query(value = "SELECT c.* FROM Cut c " +
            "WHERE c.party_id = :partyId " +
            "AND c.cut_order BETWEEN :startRange AND :endRange", nativeQuery = true)
    List<Cut> getCutsByRange(@Param("partyId") Long partyId, @Param("startRange") int startRange, @Param("endRange") int endRange);

    List<Cut> findByPartyOrderByRandomOrderAsc(Party party);


}
