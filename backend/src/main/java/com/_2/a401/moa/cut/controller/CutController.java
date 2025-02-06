package com._2.a401.moa.cut.controller;

import com._2.a401.moa.cut.dto.request.CanvasRedisRequest;
import com._2.a401.moa.cut.dto.response.CanvasRedisResponse;
import com._2.a401.moa.cut.service.CutService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cuts")
public class CutController {
    private final CutService cutService;

    @Operation(summary="임시 저장", description="그림 데이터를 임시저장합니다.")
    @PostMapping("/save-temp")
    public ResponseEntity<Void> saveTempCanvas(@Valid @RequestBody CanvasRedisRequest canvasCacheDto) {
        cutService.saveTempCanvasData(canvasCacheDto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary="임시 저장 컷 조회", description="임시저장된 그림 데이터를 조회합니다.")
    @GetMapping("/{cutId}")
    public ResponseEntity<CanvasRedisResponse> getTempCanvas(@PathVariable Long cutId) {
        return ResponseEntity.ok().body(cutService.getTempCanvasData(cutId));
    }
}
