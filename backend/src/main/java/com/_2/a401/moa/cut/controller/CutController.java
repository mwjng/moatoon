package com._2.a401.moa.cut.controller;

import com._2.a401.moa.cut.dto.request.CanvasCacheDto;
import com._2.a401.moa.cut.service.CutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cuts")
public class CutController {
    private final CutService cutService;

    @PostMapping("/save-temp")
    public ResponseEntity<Void> saveTempCanvas(
            @Valid @RequestBody CanvasCacheDto canvasCacheDto
    ) {
        cutService.saveTempCanvasData(canvasCacheDto);
        return ResponseEntity.ok().build();
    }
}
