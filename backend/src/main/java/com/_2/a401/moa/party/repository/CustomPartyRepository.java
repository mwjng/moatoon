package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.dto.response.BookInfoResponse;
import com._2.a401.moa.party.dto.response.CutResponse;

import java.util.List;

public interface CustomPartyRepository {
    List<CutResponse> getAllCuts(Long partyId);
    List<BookInfoResponse> findAllByMemberAndStatus(Long memberId, PartyState status);
}
