package com._2.a401.moa.party.controller;

import com._2.a401.moa.common.s3.S3Service;
import com._2.a401.moa.party.domain.Keyword;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.party.dto.request.PartyMemberRequest;
import com._2.a401.moa.party.dto.request.PartySearchRequest;
import com._2.a401.moa.party.dto.response.*;
import com._2.a401.moa.party.repository.KeywordRepository;
import com._2.a401.moa.party.service.PartyService;
import com._2.a401.moa.schedule.domain.Day;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/parties")
@RequiredArgsConstructor
public class PartyController {
    private final PartyService partyService;
    private final KeywordRepository keywordRepository;
    private final S3Service s3Service;


    @PostMapping
    public ResponseEntity<Long> createParty(
            @RequestParam("imageUrl") String imageUrl,
            @RequestPart("jsonData") CreatePartyRequest request) throws IOException {

        String bookCoverUrl = s3Service.uploadFromUrl(imageUrl);

        if(bookCoverUrl == null || bookCoverUrl.trim().isEmpty()){
            throw new RuntimeException("S3에 이미지 업로드 실패");
        }
        Party party = partyService.createParty(request, bookCoverUrl);
        return ResponseEntity.ok(party.getId());
    }

    @GetMapping("/{partyId}")
    public ResponseEntity<PartyDetailResponse> getPartyDetail(@PathVariable Long partyId) {
        PartyDetailResponse response = partyService.getPartyDetail(partyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pin")
    public ResponseEntity<PartyDetailResponse> getPartyFindByPin(@RequestParam String pinNumber) {
        PartyDetailResponse response = partyService.getPartyFindByPin(pinNumber);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<PartySearchResponse> searchParties(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String time,
            @RequestParam(required = false) List<Day> dayWeek,
            @RequestParam(required = false) Integer episodeLength,
            @RequestParam(required = false) Integer level,
            @RequestParam(required = false) Boolean canJoin) {

        PartySearchRequest request = new PartySearchRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        request.setTime(time);
        request.setDayWeek(dayWeek);
        request.setEpisodeLength(episodeLength);
        request.setLevel(level);
        request.setCanJoin(canJoin);

        return partyService.searchParties(request);
    }

    @GetMapping("/keyword")
    public List<KeywordResponse> getKeywords() {
        List<Keyword> keywords = keywordRepository.findAll();
        return keywords.stream()
                .map(KeywordResponse::fromEntity)  // 엔티티 -> DTO 변환
                .collect(Collectors.toList());
    }

    @PostMapping("/{partyId}/members")
    public ResponseEntity<ApiResponse> addChildrenToParty(
            @PathVariable Long partyId,
            @RequestBody PartyMemberRequest request){
        return partyService.addChildrenToParty(partyId, request.getManagerId(), request.getChildIds());
    }

    @DeleteMapping("/{partyId}/members")
    public ResponseEntity<ApiResponse> removeChildFromParty(
            @PathVariable Long partyId,
            @RequestParam Long managerId,
            @RequestParam Long childId) {
        return partyService.removeChildFromParty(partyId, managerId, childId);
    }


}
