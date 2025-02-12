package com._2.a401.moa.party.controller;

import com._2.a401.moa.common.s3.S3Service;
import com._2.a401.moa.party.domain.Keyword;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.party.dto.response.KeywordResponse;
import com._2.a401.moa.party.dto.response.PartyDetailResponse;
import com._2.a401.moa.party.repository.KeywordRepository;
import com._2.a401.moa.party.service.PartyService;
import com._2.a401.moa.schedule.domain.Schedule;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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


    @GetMapping("/keyword")
    public List<KeywordResponse> getKeywords() {
        List<Keyword> keywords = keywordRepository.findAll();
        return keywords.stream()
                .map(KeywordResponse::fromEntity)  // 엔티티 -> DTO 변환
                .collect(Collectors.toList());
    }

}
