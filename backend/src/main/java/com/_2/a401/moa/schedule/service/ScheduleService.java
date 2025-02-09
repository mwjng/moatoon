package com._2.a401.moa.schedule.service;

import com._2.a401.moa.common.redis.SessionRedisService;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.schedule.dto.ScheduleInfo;
import com._2.a401.moa.schedule.dto.response.*;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;
    private final SessionRedisService sessionRedisService;

    private static final int MAX_UPCOMING_SCHEDULES = 3;


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
        String sessionStage = getSessionStage(todaySchedule); // 오늘의 일정의 세션 진행단계 구하기
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

    private String getSessionStage(ScheduleInfo schedule) {
        if (schedule.status().equals("BEFORE")) {
            // 만약 DB에 Schedule status가 BEFORE라면 redis에 올라가지 않은 상태!
            return "BEFORE";
        }
        return sessionRedisService.getSessionStage(schedule.scheduleId());
    }


    private boolean isToday(LocalDateTime dateTime) {
        return dateTime.toLocalDate().equals(LocalDate.now());
    }
}
