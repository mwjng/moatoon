package com._2.a401.moa.cut.service;

import com._2.a401.moa.common.s3.S3Service;
import com._2.a401.moa.cut.dto.request.LineRequest;
import com._2.a401.moa.cut.dto.response.CanvasRedisResponse;
import com._2.a401.moa.cut.dto.response.CutInfoResponse;
import com._2.a401.moa.cut.repository.CutRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class DrawingService {
    private final CutService cutService;
    private final S3Service s3Service;
    private final CutRepository cutRepository;

    public void exportSVG(Long scheduleId){
        //scheduleId에 해당하는 cut 번호들 가져오기
        List<Long> cuts=cutService.getCutsInfo(scheduleId)
                .stream()
                .map(CutInfoResponse::getCutId)
                .collect(Collectors.toList());

        for(Long cutId:cuts){
            log.info("cutId: "+cutId);
            CanvasRedisResponse redisCutData=cutService.getTempCanvasData(cutId);

            if (redisCutData != null && redisCutData.getCanvasData() != null) {
                // canvasData를 LineRequest 리스트로 변환
                List<LineRequest> lines = parseCanvasData(redisCutData.getCanvasData());

                // SVG 생성
                String svgString = generateSVGFromLineRequests(lines);

                // SVG DB에 저장
                String cutFileUrl = s3Service.uploadSvgString(svgString);
                log.info(cutFileUrl);

                cutRepository.savePictureByCutId(cutFileUrl, cutId);

            }
        }
    }

    private void saveSVGFile(Long cutId, String svgContent) {
        try {
            // SVG 파일을 특정 위치에 저장
            String fileName = "drawing_" + cutId + ".svg";
            Path filePath = Paths.get("uploads", fileName);
            Files.write(filePath, svgContent.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("SVG 파일이 성공적으로 저장되었습니다: " + filePath.toString());
        } catch (IOException e) {
            e.printStackTrace();
            // 파일 저장 실패 처리
        }
    }

    private List<LineRequest> parseCanvasData(String canvasDataJson) {
        try {
            // canvasData를 LineRequest 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(canvasDataJson, objectMapper.getTypeFactory().constructCollectionType(List.class, LineRequest.class));
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList(); // 오류 발생 시 빈 리스트 반환
        }
    }

    public String generateSVGFromLineRequests(List<LineRequest> lines) {
        StringBuilder svgBuilder = new StringBuilder();
        svgBuilder.append("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\">");

        // 각 LineRequest를 기반으로 polyline 생성
        for (LineRequest line : lines) {
            // points는 x, y 쌍으로 구성되므로, 이를 적절히 포맷팅하여 "x,y x,y ..." 형식으로 변경
            String points = formatPoints(line.getPoints());
            String stroke = (line.getTool() != null && line.getTool().equals("eraser")) ? "#FFFFFF" : line.getColor();
            int strokeWidth = line.getWidth() > 0 ? line.getWidth() : 2; // 기본 선 두께는 2

            svgBuilder.append(String.format("<polyline points=\"%s\" fill=\"none\" stroke=\"%s\" stroke-width=\"%d\" />",
                    points, stroke, strokeWidth));
        }

        svgBuilder.append("</svg>");
        return svgBuilder.toString();
    }

    private String formatPoints(List<Double> points) {
        // points 리스트를 "x,y" 형식의 문자열로 변환
        StringBuilder pointsBuilder = new StringBuilder();
        for (int i = 0; i < points.size(); i += 2) {
            pointsBuilder.append(String.format("%f,%f ", points.get(i), points.get(i + 1)));
        }
        return pointsBuilder.toString().trim();
    }
}
