package com._2.a401.moa.party.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor

public class PartyResponse {
    private Long partyId;
    private String bookTitle;
    private String introduction;
    private String bookCover;
    private String pinNumber;
    private int level;
    private int episodeCount;
    private int progressCount;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean isPublic;
    private List<ScheduleResponse> schedules;
    private List<CutResponse> cuts;
    private List<String> keywords;
    private List<String> members;

    @Getter
    @Builder
    public static class ScheduleResponse {
        private LocalDateTime sessionTime;
        private String dayOfWeek;
        private int episodeNumber;
    }

    @Getter
    @Builder
    public static class CutResponse {
        private int cutOrder;
        private int randomOrder;
        private String content;
        private Long wordId;
    }
}
