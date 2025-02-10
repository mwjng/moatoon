package com._2.a401.moa.schedule.service;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;

import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.schedule.domain.Day;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.domain.ScheduleState;
//import com._2.a401.moa.schedule.dto.response.MemberSchedulesResponse;
import com._2.a401.moa.schedule.dto.response.MonthlyChildrenSchedulesResponse;
//import com._2.a401.moa.schedule.dto.response.ScheduleResponse;

import com._2.a401.moa.schedule.domain.SessionStage;
import com._2.a401.moa.schedule.dto.ScheduleInfo;
import com._2.a401.moa.schedule.dto.response.*;

import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.repository.SessionMemberRepository;
import com._2.a401.moa.schedule.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Comparator;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;

    private static final int MAX_UPCOMING_SCHEDULES = 3;
    private final SessionMemberRepository sessionMemberRepository;
    private final SessionRepository sessionRepository;


    public MonthlyChildrenSchedulesResponse getMonthlyChildrenSchedules(int year, int month) {
        // 요청을 보낸 부모의 memberId로 해당하는 아동 memberId 리스트를 들고온다.
        List<Member> children = memberRepository.findByManagerId(1L);// TODO: 추후 jwt에서 가지고와야함.

        // 각 아동의 스케줄을 조회하여 MemberSchedulesResponse를 만들고, 리스트로 만든다.
        List<MemberCalendarSchedules> childrenSchedules = children.stream()
                .map(child -> {
                    // 해당 아동이 요구하는 년도, 월에 가지고 있는 스케줄을 조회
                    List<CalendarSchedule> schedules = scheduleRepository.findSchedulesByMemberIdAndYearAndMonth(child.getId(), year, month);

                    return new MemberCalendarSchedules(
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

            Day selectedDay = Day.valueOf(sessionTime.getDayOfWeek().name());

            Schedule schedule = Schedule.builder()
                    .party(party)
                    .sessionTime(sessionTime)
                    .episodeNumber(i)
                    .dayWeek(selectedDay)
                    .status(ScheduleState.BEFORE)
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

    public TodayAndUpcomingScheduleResponse getTodayAndUpcomingSchedule(long memberId) {
        List<ScheduleInfo> schedules = scheduleRepository.findBeforeAndOngoingSchedules(memberId);

        if (schedules.isEmpty()) { // 일정이 아무것도 없으면
            return TodayAndUpcomingScheduleResponse.of(null, List.of());
        }

        ScheduleInfo firstSchedule = schedules.get(0);
        return isToday(firstSchedule.getSessionTimeAsLocalDateTime()) // 다가오는 첫번째 일정이 오늘 일정이라면
                ? createResponseWithTodaySchedule(schedules)
                : createResponseWithoutTodaySchedule(schedules);
    }


    private TodayAndUpcomingScheduleResponse createResponseWithTodaySchedule(List<ScheduleInfo> schedules) {
        ScheduleInfo todaySchedule = schedules.get(0);
        SessionStage sessionStage = getSessionStage(todaySchedule); // 오늘의 일정의 세션 진행단계 구하기
        return TodayAndUpcomingScheduleResponse.of(
                TodaySchedule.of(todaySchedule, sessionStage),
                createUpcomingSchedules(schedules, 1)
        );
    }

    private TodayAndUpcomingScheduleResponse createResponseWithoutTodaySchedule(List<ScheduleInfo> schedules) {
        return TodayAndUpcomingScheduleResponse.of(
                null,
                createUpcomingSchedules(schedules, 0)
        );
    }

    private List<UpcomingSchedule> createUpcomingSchedules(List<ScheduleInfo> schedules, int skip) {
        return schedules.stream()
                .skip(skip)
                .limit(MAX_UPCOMING_SCHEDULES)
                .map(UpcomingSchedule::from)
                .toList();
    }

    private SessionStage getSessionStage(ScheduleInfo schedule) {
        if (schedule.status().equals("BEFORE")) {
            // 만약 DB에 Schedule status가 BEFORE라면 redis에 올라가지 않은 상태!
            return SessionStage.WAITING;
        }
        return sessionRepository.fetchByScheduleId(schedule.scheduleId()).getSessionStage();
    }

    private boolean isToday(LocalDateTime dateTime) {
        return dateTime.toLocalDate().equals(LocalDate.now());
    }
}
