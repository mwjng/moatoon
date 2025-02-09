package com._2.a401.moa.cut.controller;

import com._2.a401.moa.cut.dto.request.CanvasRedisRequest;
import com._2.a401.moa.cut.dto.response.CanvasRedisResponse;
import com._2.a401.moa.cut.dto.response.PictureResponse;
import com._2.a401.moa.cut.service.CutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cuts")
public class CutController {
    private final CutService cutService;

    @Operation(summary="임시 저장", description="그림 데이터를 임시저장합니다.")
    @PostMapping("/save-temp")
    public ResponseEntity<Void> saveTempCanvas(@Valid @RequestBody CanvasRedisRequest canvasRedisRequest) {
        cutService.saveTempCanvasData(canvasRedisRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(summary="임시 저장 컷 조회", description="임시저장된 그림 데이터를 조회합니다.")
    @GetMapping("/{cutId}")
    public ResponseEntity<CanvasRedisResponse> getTempCanvas(@PathVariable Long cutId) {
        return ResponseEntity.ok().body(cutService.getTempCanvasData(cutId));
    }

    @Operation(summary="그림 저장", description="그림을 db에 저장합니다.")
    @PatchMapping(value="/save-final/{cutId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> savePicture(
            @PathVariable Long cutId,
            @Parameter(
                    description = "업로드할 파일",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestParam("file") MultipartFile file) {
        String cutImageUrl=cutService.savePicture(cutId, file);

        return ResponseEntity.ok(cutImageUrl);
    }

    @Operation(summary="완성 그림 조회", description="완성된 그림 데이터를 조회합니다.")
    @GetMapping("/final/{scheduledId}")
    public ResponseEntity<List<PictureResponse>> getFinalPicture(@PathVariable Long scheduledId) {
        return ResponseEntity.ok().body(cutService.getPictureData(scheduledId));
    }
}
