package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.dto.response.BookInfoResponse;
import com._2.a401.moa.party.dto.response.CutResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomPartyRepository {
    List<CutResponse> getAllCuts(Long partyId);
    Page<BookInfoResponse> findAllByMemberAndStatus(Long memberId, PartyState status, Pageable pageable);
}
