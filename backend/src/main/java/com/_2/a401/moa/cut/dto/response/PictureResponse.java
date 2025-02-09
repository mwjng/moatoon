package com._2.a401.moa.cut.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PictureResponse {
    private Long id;
    private String imageUrl;
    private String content;
    private int cutOrder;
}
