package com._2.a401.moa.party.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CutResponse {
    private Long cutId;
    private String imageUrl;
    private String content;
    private int cutOrder;
    private String name;
    private LocalDateTime modifiedAt;
}
