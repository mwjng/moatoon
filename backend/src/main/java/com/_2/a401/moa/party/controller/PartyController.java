package com._2.a401.moa.party.controller;

import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.party.dto.response.PartyResponse;
import com._2.a401.moa.party.service.PartyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/party")
@RequiredArgsConstructor
public class PartyController {
    private final PartyService partyService;

    @PostMapping("")
    public ResponseEntity<String> createParty(@RequestBody CreatePartyRequest request) {
        Party party = partyService.createParty(request);
        return ResponseEntity.ok("Party created successfully. ID: " + party.getId());
    }
}
