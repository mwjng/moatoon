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
public class CheckCanJoinRequest {

    private int episodeLength;
    private String time;
    private LocalDate startDate;
    private List<Day> dayWeek;
    private List<ParticipatingChild> participatingChildren;


    @Getter
    @AllArgsConstructor
    public static class ParticipatingChild {
        private Long id;
        private String name;
    }
}
