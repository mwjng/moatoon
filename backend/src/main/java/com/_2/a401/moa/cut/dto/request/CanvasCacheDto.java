package com._2.a401.moa.cut.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CanvasCacheDto implements Serializable {
    private Long cutId;
    private String canvasData;
    private LocalDateTime timestamp;
}
