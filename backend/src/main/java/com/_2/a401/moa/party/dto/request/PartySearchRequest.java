package com._2.a401.moa.party.dto.request;
import com._2.a401.moa.schedule.domain.Day;
import lombok.Getter;
import lombok.Setter;
import java.util.List;


@Getter
@Setter
public class PartySearchRequest {
    private String startDate;
    private String endDate;
    private String time;
    private List<Day> dayWeek;
    private Integer episodeLength;
    private Integer level;
    private boolean canJoin;
}
