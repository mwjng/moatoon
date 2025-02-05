package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.dto.response.CutResponse;

import java.util.List;

public interface PartyRepositoryCustom {
    List<CutResponse> getAllCutsByQuerydsl(Long partyId);
}
