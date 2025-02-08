package com._2.a401.moa.schedule.service;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.schedule.dto.response.MemberCalendarSchedules;
import com._2.a401.moa.schedule.dto.response.MonthlyChildrenSchedulesResponse;
import com._2.a401.moa.schedule.dto.response.CalendarSchedule;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final MemberRepository memberRepository;


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
}
