package com._2.a401.moa.cut.repository;

import com._2.a401.moa.cut.domain.Cut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CutRepository extends JpaRepository<Cut, Long> {

    @Modifying
    @Query(value = "UPDATE Cut c SET c.image_url=:cutFileUrl WHERE c.id=:cutId"
    , nativeQuery = true)
    void savePictureByCutId(String cutFileUrl, Long cutId);
}
