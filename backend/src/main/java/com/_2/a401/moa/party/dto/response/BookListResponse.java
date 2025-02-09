package com._2.a401.moa.party.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookListResponse {
    private Long memberId;
    private List<BookInfoResponse> bookList;
    private long totalBooks;
    private int totalPages;
    private int currentPage;
}
