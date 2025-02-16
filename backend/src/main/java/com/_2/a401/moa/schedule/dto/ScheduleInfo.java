package com._2.a401.moa.schedule.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record ScheduleInfo(
        Long scheduleId,
        String bookTitle,
        String bookCover,
        Integer episodeNumber,
        String sessionTime,
        String status,
        String pinNumber
) {
    public LocalDateTime getSessionTimeAsLocalDateTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"); // 형식에 맞게 패턴 설정 (구 h2 버전: "yyyy-MM-dd HH:mm:ss")
        return LocalDateTime.parse(sessionTime, formatter); // sessionTime을 LocalDateTime으로 변환
    }
}
