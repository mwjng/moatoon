package com._2.a401.moa.party.repository;

import java.util.List;

import com._2.a401.moa.party.dto.request.PartySearchRequest;
import com.querydsl.core.Tuple;


public interface PartyRepositoryCustomImpl {
    List<Tuple> searchParties(PartySearchRequest request);
}

