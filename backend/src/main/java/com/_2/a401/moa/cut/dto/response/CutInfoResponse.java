package com._2.a401.moa.cut.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CutInfoResponse {
    private Long cutId;
    private String content;
    private int cutOrder;
    private Long memberId;
    private String nickname;
    private Long wordId;
    private Long partyId;
}
