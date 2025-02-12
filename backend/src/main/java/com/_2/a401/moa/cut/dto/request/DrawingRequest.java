package com._2.a401.moa.cut.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DrawingRequest {
    private Long partyId;
    private Long cutId;
    private String type;
    private LineRequest line;
    private LineRequest redoLine;
}
