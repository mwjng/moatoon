package com._2.a401.moa.party.controller;

import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.dto.response.BookListResponse;
import com._2.a401.moa.party.dto.response.EBookResponse;
import com._2.a401.moa.party.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class BookController {
    private final BookService bookService;

    @GetMapping("/books/{memberId}")
    public ResponseEntity<BookListResponse> getBookList(
            @PathVariable Long memberId,
            @RequestParam(required = false, defaultValue = "BEFORE") PartyState status
    ) {
        return ResponseEntity.ok().body(bookService.getAllBooks(memberId, status));
    }

    @GetMapping("/books/ebook/{partyId}")
    public ResponseEntity<EBookResponse> getEbook(
            @PathVariable Long partyId
    ) {
        return ResponseEntity.ok().body(bookService.getEBook(partyId));
    }

}
