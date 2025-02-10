package com._2.a401.moa.schedule.service;

import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.schedule.domain.Day;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.domain.ScheduleState;
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
public class InitialScheduleService {

    private final ScheduleRepository scheduleRepository;

    /**
     * ✅ 초기 스케줄 생성: 시작일과 요일을 기준으로 일정 저장
     */
    @Transactional
    public void createSchedules(Party party, List<Day> dayWeek, int episodeLength) {
        LocalDateTime sessionTime = adjustStartDateToNearestDay(party.getStartDate(), dayWeek);

        for (int i = 1; i <= episodeLength; i++) {
            Day selectedDay = Day.valueOf(sessionTime.getDayOfWeek().name());

            Schedule schedule = Schedule.builder()
                    .party(party)
                    .sessionTime(sessionTime)
                    .episodeNumber(i)
                    .dayWeek(selectedDay)
                    .status(ScheduleState.BEFORE) // 기본 상태
                    .build();

            scheduleRepository.save(schedule);
            sessionTime = getNextSessionDate(sessionTime, dayWeek);
        }
    }

    /**
     * ✅ 종료 날짜 계산: startDate부터 요일을 고려하여 마지막 세션 날짜 반환
     */
    public LocalDateTime calculateEndDate(LocalDateTime startDate, List<Day> dayWeek, int episodeLength) {
        LocalDateTime sessionTime = adjustStartDateToNearestDay(startDate, dayWeek);

        for (int i = 1; i < episodeLength; i++) {
            sessionTime = getNextSessionDate(sessionTime, dayWeek);
        }
        return sessionTime;
    }

    /**
     * ✅ 시작 날짜를 주어진 요일 중 가장 가까운 날짜로 조정
     */
    private LocalDateTime adjustStartDateToNearestDay(LocalDateTime startDate, List<Day> days) {
        List<DayOfWeek> selectedDays = convertToDayOfWeek(days);

        // ✅ 가장 가까운 미래 요일 찾기
        for (int i = 0; i < 7; i++) {
            LocalDateTime nextDate = startDate.plusDays(i);
            if (selectedDays.contains(nextDate.getDayOfWeek())) {
                return nextDate;
            }
        }
        return startDate; // 기본적으로는 변경 없음 (예외 처리)
    }

    /**
     * ✅ 선택된 요일을 기반으로 다음 세션 날짜를 계산
     */
    private LocalDateTime getNextSessionDate(LocalDateTime current, List<Day> days) {
        List<DayOfWeek> selectedDays = convertToDayOfWeek(days);
        DayOfWeek currentDay = current.getDayOfWeek();

        // ✅ 현재 날짜 이후의 가장 가까운 요일 찾기
        for (int i = 1; i <= 7; i++) {
            LocalDateTime nextDate = current.plusDays(i);
            if (selectedDays.contains(nextDate.getDayOfWeek())) {
                return nextDate;
            }
        }
        return current; // 기본적으로는 변경 없음
    }

    /**
     * ✅ Day Enum을 Java의 DayOfWeek으로 변환
     */
    private List<DayOfWeek> convertToDayOfWeek(List<Day> days) {
        return days.stream()
                .map(day -> DayOfWeek.valueOf(day.name()))
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .collect(Collectors.toList());
    }
}
