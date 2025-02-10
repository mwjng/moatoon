package com._2.a401.moa.party.dto.request;

import com._2.a401.moa.schedule.domain.Day;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class CreatePartyRequest {
    private String coverImage;
    private int level;
    private int episodeLength;
    private boolean publicStatus;
    private String time;
    private LocalDate startDate;
    private List<Day> dayWeek;
    private int genre;
    private int mood;
    private int theme;
    private StoryRequest story;
    private List<ParticipatingChild> participatingChildren;

    @Getter
    @AllArgsConstructor
    public static class StoryRequest {
        private String title;
        private String overview;
        private List<ChapterRequest> chapters;
    }

    @Getter
    @AllArgsConstructor
    public static class ChapterRequest {
        private String title;
        private List<String> sentences;
        private List<WordRequest> words;
    }

    @Getter
    @AllArgsConstructor
    public static class WordRequest {
        private Long id;
        private String word;
    }

    @Getter
    @AllArgsConstructor
    public static class ParticipatingChild {
        private Long id;
        private String name;
    }
}
