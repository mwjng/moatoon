package com._2.a401.moa.party.service;

import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.member.domain.MemberState;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.dto.response.BookListResponse;
import com._2.a401.moa.party.dto.response.BookInfoResponse;
import com._2.a401.moa.party.dto.response.CutResponse;
import com._2.a401.moa.party.dto.response.EBookResponse;
import com._2.a401.moa.party.repository.PartyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BookService {
    private final PartyRepository partyRepository;
    private final MemberRepository memberRepository;

    //방 생성

    public BookListResponse getAllBooks(Long myId, Long memberId, boolean isCompleted, Pageable pageable){

        // 내 아이디가 보려는 아이디랑 다른 경우, memberId가 내 자녀인지 검증 필요
        if (!myId.equals(memberId)) {
            // 자녀 검증 로직
            boolean isMyChild = memberRepository.existsByIdAndManagerIdAndStatus(memberId, myId, MemberState.ACTIVE);
            if (!isMyChild) {
                throw new MoaException(ExceptionCode.INVALID_AUTHORITY);
            }
        }

        Page<BookInfoResponse> bookPage = partyRepository.findAllByMemberAndProgressStatus(memberId, isCompleted, pageable);

        BookListResponse response = BookListResponse.builder()
                .memberId(memberId)
                .bookList(bookPage.getContent())
                .totalBooks(bookPage.getTotalElements()) // 총 데이터 수
                .totalPages(bookPage.getTotalPages()) // 총 페이지 수
                .currentPage(bookPage.getNumber()) // 현재 페이지
                .build();

        return response;
    }

    public EBookResponse getEBook(Long partyId){
        List<CutResponse> cuts = partyRepository.getAllCuts(partyId);

        Party party=partyRepository.findById(partyId)
                .orElseThrow(() -> new EntityNotFoundException("해당 파티를 찾을 수 없습니다."));

        EBookResponse ebook= EBookResponse.builder()
                .partyId(partyId)
                .bookCover(party.getBookCover())
                .bookTitle(party.getBookTitle())
                .cuts(cuts)
                .build();

        return ebook;
    }


}
