package com._2.a401.moa.schedule.service;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.dto.response.MemberSchedulesResponse;
import com._2.a401.moa.schedule.dto.response.MonthlyChildrenSchedulesResponse;
import com._2.a401.moa.schedule.dto.response.ScheduleResponse;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;


    public MonthlyChildrenSchedulesResponse getMonthlyChildrenSchedules(int year, int month) {
        // 요청을 보낸 부모의 memberId로 해당하는 아동 memberId 리스트를 들고온다.
        List<Member> children = memberRepository.findByManagerId(1L);// TODO: 추후 jwt에서 가지고와야함.

        // 각 아동의 스케줄을 조회하여 MemberSchedulesResponse를 만들고, 리스트로 만든다.
        List<MemberSchedulesResponse> childrenSchedules = children.stream()
                .map(child -> {
                    // 해당 아동이 요구하는 년도, 월에 가지고 있는 스케줄을 조회
                    List<ScheduleResponse> schedules = scheduleRepository.findSchedulesByMemberIdAndYearAndMonth(child.getId(), year, month);

                    return new MemberSchedulesResponse(
                            child.getId(), // 아동의 ID
                            child.getName(), // 아동의 이름
                            schedules
                    );
                }).toList();

        // 월별 아동 스케줄 응답 반환
        return new MonthlyChildrenSchedulesResponse(month, childrenSchedules);
    }



    @Transactional
    public void createSchedules(Party party, List<String> dayOfWeek, int episodeLength) {
        LocalDateTime sessionTime = adjustStartDateToNearestDay(party.getStartDate(), dayOfWeek);
        for (int i = 1; i <= episodeLength; i++) {
            Schedule schedule = Schedule.builder()
                    .party(party)
                    .sessionTime(sessionTime)
                    .episodeNumber(i)
                    .build();

            scheduleRepository.save(schedule);
            sessionTime = getNextSessionDate(sessionTime, dayOfWeek);
        }
    }

    public LocalDateTime calculateEndDate(LocalDateTime startDate, List<String> dayOfWeek, int episodeLength) {
        LocalDateTime sessionTime = adjustStartDateToNearestDay(startDate, dayOfWeek);
        for (int i = 1; i < episodeLength; i++) {
            sessionTime = getNextSessionDate(sessionTime, dayOfWeek);
        }
        return sessionTime;
    }

    /**
     * 주어진 시작 날짜 이후 가장 가까운 선택한 요일을 찾는 함수
     */
    private LocalDateTime adjustStartDateToNearestDay(LocalDateTime startDate, List<String> days) {
        List<DayOfWeek> selectedDays = convertToDayOfWeek(days);
        LocalDateTime adjustedDate = startDate;

        while (!selectedDays.contains(adjustedDate.getDayOfWeek())) {
            adjustedDate = adjustedDate.plusDays(1);
        }

        return adjustedDate;
    }

    /**
     * 선택된 요일을 기반으로 다음 세션 날짜를 계산
     */
    private LocalDateTime getNextSessionDate(LocalDateTime current, List<String> days) {
        List<DayOfWeek> selectedDays = convertToDayOfWeek(days);

        // 현재 요일 이후에 가장 가까운 요일을 찾기
        DayOfWeek currentDay = current.getDayOfWeek();
        DayOfWeek nextDay = selectedDays.stream()
                .filter(day -> day.getValue() > currentDay.getValue())
                .min(Comparator.naturalOrder())
                .orElse(selectedDays.get(0)); // 없으면 첫 번째 요일로 순환

        int daysToAdd = (nextDay.getValue() - currentDay.getValue() + 7) % 7;
        if (daysToAdd == 0) {
            daysToAdd = 7; // 같은 날에 반복되지 않도록 1주일 뒤로
        }

        return current.plusDays(daysToAdd);
    }

    /**
     * String 형태의 요일 목록을 DayOfWeek Enum으로 변환
     */
    private List<DayOfWeek> convertToDayOfWeek(List<String> days) {
        return days.stream()
                .map(DayOfWeek::valueOf)
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .collect(Collectors.toList());
    }
}
