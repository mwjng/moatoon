package com._2.a401.moa.party.service;

import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.dto.response.BookListResponse;
import com._2.a401.moa.party.dto.response.BookInfoResponse;
import com._2.a401.moa.party.dto.response.CutResponse;
import com._2.a401.moa.party.dto.response.EBookResponse;
import com._2.a401.moa.party.repository.PartyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BookService {
    private final PartyRepository partyRepository;

    public BookListResponse getAllBooks(Long memberId, PartyState status){
        List<BookInfoResponse> books = partyRepository.findAllByMemberAndStatus(memberId, status);
        System.out.println(books);

        BookListResponse response = BookListResponse.builder()
                .memberId(memberId)
                .bookList(books)
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
