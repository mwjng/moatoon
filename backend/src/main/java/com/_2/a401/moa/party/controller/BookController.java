package com._2.a401.moa.party.controller;

import com._2.a401.moa.party.dto.response.BookListResponse;
import com._2.a401.moa.party.dto.response.EBookResponse;
import com._2.a401.moa.party.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class BookController {
    private final BookService bookService;

    @Operation(summary="책 목록 조회", description="완료 또는 완료 전인 책 목록을 조회합니다.")
    @GetMapping("/books/{memberId}")
    public ResponseEntity<BookListResponse> getBookList(
            @PathVariable Long memberId,
            @RequestParam(required = false, defaultValue = "BEFORE") boolean isCompleted,
            Pageable pageable
    ) {
        return ResponseEntity.ok().body(bookService.getAllBooks(memberId, isCompleted, pageable));
    }

    @GetMapping("/books/ebook/{partyId}")
    public ResponseEntity<EBookResponse> getEbook(
            @PathVariable Long partyId
    ) {
        return ResponseEntity.ok().body(bookService.getEBook(partyId));
    }

}
