package com._2.a401.moa.party.controller;

import com._2.a401.moa.party.domain.Keyword;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.party.dto.response.KeywordResponse;
import com._2.a401.moa.party.dto.response.PartyResponse;
import com._2.a401.moa.party.repository.KeywordRepository;
import com._2.a401.moa.party.service.PartyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/parties")
@RequiredArgsConstructor
public class PartyController {
    private final PartyService partyService;
    private final KeywordRepository keywordRepository;

    @PostMapping("")
    public ResponseEntity<String> createParty(@RequestBody CreatePartyRequest request) {
        Party party = partyService.createParty(request);
        return ResponseEntity.ok("Party created successfully. ID: " + party.getId());
    }

    @GetMapping("/keyword")
    public List<KeywordResponse> getKeywords() {
        List<Keyword> keywords = keywordRepository.findAll();
        return keywords.stream()
                .map(KeywordResponse::fromEntity)  // 엔티티 -> DTO 변환
                .collect(Collectors.toList());
    }
}
