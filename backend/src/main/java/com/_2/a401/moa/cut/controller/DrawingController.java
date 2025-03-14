package com._2.a401.moa.cut.controller;

import com._2.a401.moa.cut.dto.request.DrawingRequest;
import com._2.a401.moa.cut.service.DrawingService;
import com._2.a401.moa.party.repository.PartyRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequiredArgsConstructor
public class DrawingController {
    private final SimpMessagingTemplate messagingTemplate;
    private final PartyRepository partyRepository;
    private final DrawingService drawingService;

    @MessageMapping("/draw")
    public void handleDraw(@Payload DrawingRequest message) throws JsonProcessingException {
        Long partyId = message.getPartyId();
        //System.out.println("Received message for party " + partyId + ": " + message);

        // 해당 party에 속한 사용자 목록 조회
        //List<Long> userIdsInRoom = partyRepository.findUserIdsByPartyId(partyId);
        String messageJson = new ObjectMapper().writeValueAsString(message);

        // 방에 속한 사용자들에게 메시지 전송
        messagingTemplate.convertAndSend("/topic/party/" + partyId, messageJson);
    
    }

    @GetMapping("/exportSVG")
    public String exportSVG(@RequestParam Long scheduleId) {
        try {
            // exportSVG 메서드 호출
            drawingService.exportSVG(scheduleId);
            return "SVG export successful!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred during SVG export.";
        }
    }

}
