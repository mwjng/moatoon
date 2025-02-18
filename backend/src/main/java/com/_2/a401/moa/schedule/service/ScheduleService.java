package com._2.a401.moa.schedule.service;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberState;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.schedule.domain.FullSessionStage;
import com._2.a401.moa.schedule.dto.ScheduleInfo;
import com._2.a401.moa.schedule.dto.response.*;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.repository.SessionRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;

    private static final int MAX_UPCOMING_SCHEDULES = 3;
    private final SessionRedisRepository sessionRedisRepository;


    public MonthlyChildrenSchedulesResponse getMonthlyChildrenSchedules(Long memberId, int year, int month) {
        // 요청을 보낸 부모의 memberId로 해당하는 아동 memberId 리스트를 들고온다.
        List<Member> children = memberRepository.findAllByManagerId(memberId);

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
        log.info("ScheduleService.getTodayAndUpcomingSchedule");
        List<ScheduleInfo> schedules = scheduleRepository.findBeforeAndOngoingSchedules(memberId);

        if (schedules.isEmpty()) { // 일정이 아무것도 없으면
            log.info("오늘 일정 없음");
            return TodayAndUpcomingScheduleResponse.of(null, List.of());
        }

        log.info("일정 개수: {}", schedules.size());
        for (ScheduleInfo scheduleInfo : schedules) {
            log.info("일정: {}", scheduleInfo.toString());
        }
        ScheduleInfo firstSchedule = schedules.get(0);

        log.info("첫 일정의 날짜: {}", firstSchedule.getSessionTimeAsLocalDateTime());
        log.info("오늘의 날짜: {}", LocalDate.now());
        boolean isTodaySchedule = isToday(firstSchedule.getSessionTimeAsLocalDateTime());
        log.info("처음 일정이 오늘인가?: {}", isTodaySchedule);

        TodayAndUpcomingScheduleResponse response = isTodaySchedule
                ? createResponseWithTodaySchedule(schedules)
                : createResponseWithoutTodaySchedule(schedules);

        return response;
//        return isToday(firstSchedule.getSessionTimeAsLocalDateTime()) // 다가오는 첫번째 일정이 오늘 일정이라면
//                ? createResponseWithTodaySchedule(schedules)
//                : createResponseWithoutTodaySchedule(schedules);
    }


    private TodayAndUpcomingScheduleResponse createResponseWithTodaySchedule(List<ScheduleInfo> schedules) {
        ScheduleInfo todaySchedule = schedules.get(0);
        FullSessionStage sessionStage = getSessionStage(todaySchedule); // 오늘의 일정의 세션 진행단계 구하기
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
        // 필요한 모든 scheduleId들을 한번에 조회
        List<Long> scheduleIds = schedules.stream()
                .skip(skip)
                .limit(MAX_UPCOMING_SCHEDULES)
                .map(ScheduleInfo::scheduleId)
                .toList();


        log.info(scheduleIds.toString());

        // 한번의 쿼리로 모든 partyId 조회
        Map<Long, Long> scheduleToPartyMap = scheduleRepository
                .findPartyIdsByScheduleIds(scheduleIds)
                .stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).longValue(),  // id를 key로
                        row -> ((Number) row[1]).longValue()   // party_id를 value로
                ));

        return schedules.stream()
                .skip(skip)
                .limit(MAX_UPCOMING_SCHEDULES)
                .map(schedule -> UpcomingSchedule.from(
                        schedule,
                        scheduleToPartyMap.getOrDefault(schedule.scheduleId(), null)
                ))
                .toList();
    }

    private FullSessionStage getSessionStage(ScheduleInfo schedule) {
        if (schedule.status().equals("BEFORE")) {
            // 만약 DB에 Schedule status가 BEFORE라면 redis에 올라가지 않은 상태!
            return FullSessionStage.WAITING;
        }
        return sessionRedisRepository.fetchByScheduleId(schedule.scheduleId()).getSessionStage();
    }

    private boolean isToday(LocalDateTime dateTime) {
        return dateTime.toLocalDate().equals(LocalDate.now());
    }
}
