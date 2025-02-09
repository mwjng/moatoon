package com._2.a401.moa.party.dto.request;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class CreatePartyRequest {
    private String coverImage;
    private int level;
    private int episodeLength;
    private boolean publicStatus;
    private String time;
    private LocalDate startDate;
    private List<String> dayOfWeek;
    private int genre;
    private int mood;
    private int theme;
    private StoryRequest story;
    private List<ParticipatingChild> participatingChildren;

    @Getter
    public static class StoryRequest {
        private String title;
        private String overview;
        private List<ChapterRequest> chapters;
    }

    @Getter
    public static class ChapterRequest {
        private String title;
        private List<String> sentences;
        private List<WordRequest> words;
    }

    @Getter
    public static class WordRequest {
        private Long id;
        private String word;
    }

    @Getter
    public static class ParticipatingChild {
        private Long id;
        private String name;
    }
}
