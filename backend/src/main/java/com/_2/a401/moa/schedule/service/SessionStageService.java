package com._2.a401.moa.schedule.service;

import com._2.a401.moa.schedule.domain.FullSessionStage;
import com._2.a401.moa.schedule.domain.Session;
import com._2.a401.moa.schedule.domain.SessionMember;
import com._2.a401.moa.schedule.dto.response.WsReadyStatusResponse;
import com._2.a401.moa.schedule.dto.response.WsSessionTransferResponse;
import com._2.a401.moa.schedule.repository.SessionMemberRedisRepository;
import com._2.a401.moa.schedule.repository.SessionRedisRepository;
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
    private final SessionRedisRepository sessionRedisRepository;
    private final SessionMemberRedisRepository sessionMemberRedisRepository;
    private final SimpMessagingTemplate messagingTemplate;
    @Qualifier("messageBrokerTaskScheduler")  // WebSocket의 TaskScheduler 사용 - TaskScheduler 빈 충돌 해결용
    private final TaskScheduler taskScheduler;

    public void dummyRedis(){
        // 13번 사용자가 1번 세션에 참여하고 있음, 1번 세션은 지금 WORD 상태임(세션 시작 30분전부터)
        final Session session = new Session(1L, "openviduSessionId", WAITING, LocalDateTime.now().minusMinutes(9));
        sessionRedisRepository.save(session);

        SessionMember sessionMember = new SessionMember(1L);
        sessionMember.addMember(13L);
        sessionMemberRedisRepository.save(sessionMember);

        setWaitingRoomTimer(1L);
    }

    public void updateReadyStatus(Long scheduleId, Long memberId, boolean isReady) {
        //dummyRedis();
        log.info("[서버] 레디 요청 날라옴");
        log.info("updateReadyStatus: scheduleId={}, memberId={}", scheduleId, memberId);
        //sessionService.validateMemberPermission(memberId, scheduleId); // 권한 검증

        // Redis에서 sessionMember 불러오기
        SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
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

    // 다음 단계로 이동
    private void handleSessionTransfer(Long scheduleId) {
        // 현재 세션 정보 조회
        Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
        FullSessionStage currentSessionStage = session.getSessionStage(); // 현재 단계

        // 다음 단계 및 시작시간 계산
        FullSessionStage nextSessionStage = FullSessionStage.next(currentSessionStage); // 다음단계
        LocalDateTime now = LocalDateTime.now(); // 시작시간

        // [Redis- session:scheduleId 정보 변경]  다음 세션으로 넘어가면서, sessionStage 및 startTime 갱신
        session.updateSessionStageAndStartTime(nextSessionStage, now);
        sessionRedisRepository.save(session);  // 변경사항을 Redis에 저장

        // [Redis- sessionMember:scheduleId 정보 변경] Ready 상태 초기화
        SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        sessionMember.resetReadyStatus();
        sessionMemberRedisRepository.save(sessionMember);
        log.info("handleSessionTransfer: scheduleId={}, ", scheduleId);

        // 다음 타이머 예약
        if (nextSessionStage != FullSessionStage.DONE) {
            setEndTimeTimer(scheduleId, now.plusSeconds(nextSessionStage.getDuration()), nextSessionStage);
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
        log.info("세션 {} 전환 메세지 전송 완료", scheduleId);
    }

    // 종료시간에 실행될 타이머
    private void setEndTimeTimer(Long scheduleId, LocalDateTime endTime, FullSessionStage expectedStage) {
        log.info("[SessionStageService] setEndTimeTimer 설정됨: scheduleId={}, endTime={}, 현재단계 expectedStage={}", scheduleId, endTime, expectedStage);
        taskScheduler.schedule(
                () -> {
                    log.info("타이머 완료!!!");
                    // 현재 세션 정보 조회
                    Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
                    FullSessionStage currentStage = session.getSessionStage();
                    log.info(String.valueOf(session));

                    // 예상했던 단계와 현재 단계가 같을 때만 전환
                    log.info("{} == {}??", currentStage, expectedStage);
                    if (currentStage == expectedStage) {
                        log.info("{} 에서 다음 단계로 이동~", expectedStage);
                        handleSessionTransfer(scheduleId);
                    }
                },
                endTime.atZone(ZoneId.systemDefault()).toInstant()
        );
    }

    // 외부(WaitingRoom)에서 호출할  최초 타이머(대기방에서 10분 뒤 울릴 알람) 설정
    public void setWaitingRoomTimer(Long scheduleId) {
        Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
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