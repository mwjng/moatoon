package com._2.a401.moa.party.dto.response;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import com._2.a401.moa.party.domain.Keyword;

@Getter
@RequiredArgsConstructor
public class KeywordResponse {
    private final Long id;
    private final String keyword;
    private final String option;

    // 엔티티 -> DTO 변환 메서드
    public static KeywordResponse fromEntity(Keyword keyword) {
        return new KeywordResponse(
                keyword.getId(),
                keyword.getKeyword(),
                keyword.getOption().name()  // Enum -> String 변환
        );
    }
}
