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
                    .status(ScheduleState.BEFORE)
                    .build();

            scheduleRepository.save(schedule);
            sessionTime = getNextSessionDate(sessionTime, dayWeek);
        }
    }

    public LocalDateTime calculateEndDate(LocalDateTime startDate, List<Day> dayWeek, int episodeLength) {
        LocalDateTime sessionTime = adjustStartDateToNearestDay(startDate, dayWeek);

        for (int i = 1; i < episodeLength; i++) {
            sessionTime = getNextSessionDate(sessionTime, dayWeek);
        }
        return sessionTime;
    }

    private LocalDateTime adjustStartDateToNearestDay(LocalDateTime startDate, List<Day> days) {
        List<DayOfWeek> selectedDays = convertToDayOfWeek(days);

        for (int i = 0; i < 7; i++) {
            LocalDateTime nextDate = startDate.plusDays(i);
            if (selectedDays.contains(nextDate.getDayOfWeek())) {
                return nextDate;
            }
        }
        return startDate;
    }

    private LocalDateTime getNextSessionDate(LocalDateTime current, List<Day> days) {
        List<DayOfWeek> selectedDays = convertToDayOfWeek(days);
        DayOfWeek currentDay = current.getDayOfWeek();

        for (int i = 1; i <= 7; i++) {
            LocalDateTime nextDate = current.plusDays(i);
            if (selectedDays.contains(nextDate.getDayOfWeek())) {
                return nextDate;
            }
        }
        return current;
    }

    private List<DayOfWeek> convertToDayOfWeek(List<Day> days) {
        return days.stream()
                .map(day -> DayOfWeek.valueOf(day.name()))
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .collect(Collectors.toList());
    }
}
