package com._2.a401.moa.cut.repository;

import com._2.a401.moa.cut.domain.Cut;
import com._2.a401.moa.cut.dto.response.PictureResponse;
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

    @Query(value = "SELECT c.* " +
            "FROM cut c " +
            "JOIN party p ON p.id=c.party_id " +
            "JOIN schedule s ON s.party_id=p.id " +
            "WHERE s.id = :scheduleId AND " +
            "c.cut_order BETWEEN (s.episode_number*4-3) AND (s.episode_number*4)", nativeQuery = true)
    List<Cut> getCutsByRange(@Param("scheduleId") Long scheduleId);
}
