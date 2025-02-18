package com._2.a401.moa.cut.dto.request;

import lombok.Getter;

import java.util.List;

@Getter
public class LineRequest {
    private String tool;
    private String color; // 색상
    private int width; // 선 두께
    private List<Double> points; // 점들의 좌표 (x, y)

    public LineRequest() {}

    public LineRequest(String tool, List<Double> points, String color, int width) {
        this.tool = tool;
        this.points = points;
        this.color = color;
        this.width = width;
    }
}
