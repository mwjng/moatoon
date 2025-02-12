package com._2.a401.moa.party.dto.response;

import com._2.a401.moa.schedule.domain.Day;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PartyDetailResponse {
    private String pinNumber;
    private String title;
    private String bookCover;
    private String imageUrl;
    private LocalDateTime startDate;
    private List<Day> dayWeeks;
    private int level;
    private int progressCount;
    private int episodeCount;
    private String introduction;
    private List<KeywordResponse> keywords;
    private List<PartyMemberResponse> members;
}
