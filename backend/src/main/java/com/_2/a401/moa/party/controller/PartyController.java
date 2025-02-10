package com._2.a401.moa.party.controller;

import com._2.a401.moa.common.s3.S3Service;
import com._2.a401.moa.party.domain.Keyword;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.party.dto.response.KeywordResponse;
import com._2.a401.moa.party.repository.KeywordRepository;
import com._2.a401.moa.party.service.PartyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final S3Service s3Service; // 🔹 S3 업로드 서비스 추가

    @PostMapping
    public ResponseEntity<String> createParty(
            @RequestParam("imageUrl") String imageUrl,
            @RequestPart("jsonData") CreatePartyRequest request) throws IOException {

        String bookCoverUrl = s3Service.uploadFromUrl(imageUrl);

        if(bookCoverUrl == null || bookCoverUrl.trim().isEmpty()){
            throw new RuntimeException("S3에 이미지 업로드 실패");
        }

        partyService.createParty(request, bookCoverUrl);

        return ResponseEntity.ok("생성된 이미지 S3 url : "+bookCoverUrl);
    }

    @GetMapping("/keyword")
    public List<KeywordResponse> getKeywords() {
        List<Keyword> keywords = keywordRepository.findAll();
        return keywords.stream()
                .map(KeywordResponse::fromEntity)  // 엔티티 -> DTO 변환
                .collect(Collectors.toList());
    }
}
