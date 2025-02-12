package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.domain.FullSessionStage;
import com._2.a401.moa.schedule.domain.Session;
import com._2.a401.moa.schedule.domain.SessionMember;
import com._2.a401.moa.schedule.dto.response.WsReadyStatusResponse;
import com._2.a401.moa.schedule.dto.response.WsSessionTransferResponse;
import com._2.a401.moa.schedule.repository.SessionMemberRepository;
import com._2.a401.moa.schedule.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

import static com._2.a401.moa.schedule.domain.FullSessionStage.WAITING;

@RequiredArgsConstructor
@Service
@Slf4j
public class SessionStageService {
    private final SessionService sessionService;
    private final SessionRepository sessionRepository;
    private final SessionMemberRepository sessionMemberRepository;
    private final SimpMessagingTemplate messagingTemplate;
    @Qualifier("messageBrokerTaskScheduler")  // WebSocket의 TaskScheduler 사용 - TaskScheduler 빈 충돌 해결용
    private final TaskScheduler taskScheduler;

    private void dummyRedis(){
        final Session session = new Session(1L, "openviduSessionId", WAITING);
        sessionRepository.save(session);
        sessionMemberRepository.save(new SessionMember(1L));
    }

    public void updateReadyStatus(Long scheduleId, Long memberId, boolean isReady) {
        dummyRedis();
        log.info("updateReadyStatus: scheduleId={}, memberId={}", scheduleId, memberId);
        //sessionService.validateMemberPermission(memberId, scheduleId); // 권한 검증

        // Redis에서 sessionMember 불러오기
        SessionMember sessionMember = sessionMemberRepository.fetchByScheduleId(scheduleId);
        sessionMember.setReadyStatus(memberId, isReady); // 준비 상태 변경

        if (sessionMember.checkAllMembersReady()) {
            handleSessionTransfer(scheduleId);
        } else {
            broadcastReadyStatus(scheduleId, sessionMember.getSessionMembers());
        }
    }

    // 모두 레디가 안되었을 경우 : 각 멤버의 레디 상태 안내
    private void broadcastReadyStatus(Long scheduleId, Map<Long, Boolean> readyMembers) {
        log.info("broadcastReadyStatus: scheduleId={}, readyMembers={}", scheduleId, readyMembers);
        WsReadyStatusResponse response = WsReadyStatusResponse.builder()
                .type("READY_STATUS")
                .readyMembers(readyMembers)
                .build();

        messagingTemplate.convertAndSend("/topic/session-stage/" + scheduleId, response);
    }

    // 모두 레디가 되었을 경우 : 다음 단계로 이동
    private void handleSessionTransfer(Long scheduleId) {
        log.info("handleSessionTransfer: scheduleId={}", scheduleId);
        // 현재 세션 정보 조회
        Session session = sessionRepository.fetchByScheduleId(scheduleId);
        FullSessionStage currentSessionStage = session.getSessionStage(); // 현재 단계

        // 다음 단계 및 시작시간 계산
        FullSessionStage nextSessionStage = FullSessionStage.next(currentSessionStage); // 다음단계
        LocalDateTime now = LocalDateTime.now(); // 시작시간

        // [Redis- session:scheduleId 정보 변경]  다음 세션으로 넘어가면서, sessionStage 및 startTime 갱신
        session.updateSessionStageAndStartTime(nextSessionStage, now);

        // [Redis- sessionMember:scheduleId 정보 변경] Ready 상태 초기화
        SessionMember sessionMember = sessionMemberRepository.fetchByScheduleId(scheduleId);
        sessionMember.resetReadyStatus();

        // 다음 타이머 예약
        if (nextSessionStage != FullSessionStage.DONE) {
            setEndTimeTimer(scheduleId, now.plusSeconds(nextSessionStage.getDuration()), currentSessionStage);
        }

        // 세션 전환 메시지 생성
        WsSessionTransferResponse response = WsSessionTransferResponse.builder()
                .type("SESSION_TRANSFER")
                .currentSessionStage(currentSessionStage)
                .nextSessionStage(nextSessionStage)
                .sessionStartTime(now)
                .sessionDuration(nextSessionStage.getDuration())
                .build();

        // 세션 전환 메시지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/session-stage/" + scheduleId, response);
    }

    // 종료시간에 실행될 타이머
    private void setEndTimeTimer(Long scheduleId, LocalDateTime endTime, FullSessionStage expectedStage) {
        taskScheduler.schedule(
                () -> {
                    // 현재 세션 정보 조회
                    Session session = sessionRepository.fetchByScheduleId(scheduleId);
                    FullSessionStage currentStage = session.getSessionStage();

                    // 예상했던 단계와 현재 단계가 같을 때만 전환
                    if (currentStage == expectedStage) {
                        handleSessionTransfer(scheduleId);
                    }
                },
                endTime.atZone(ZoneId.systemDefault()).toInstant()
        );
    }

    // 외부(WaitingRoom)에서 호출할  최초 타이머 설정
    public void startSessionTimer(Long scheduleId) {
        Session session = sessionRepository.fetchByScheduleId(scheduleId);
        FullSessionStage currentStage = session.getSessionStage();
        LocalDateTime startTime = session.getStartTime();

        if (currentStage != FullSessionStage.DONE) {
            setEndTimeTimer(
                    scheduleId,
                    startTime.plusSeconds(currentStage.getDuration()),
                    currentStage
            );
        }
    }
}