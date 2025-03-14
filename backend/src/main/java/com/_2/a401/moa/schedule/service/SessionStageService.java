package com._2.a401.moa.schedule.service;

import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.cut.dto.response.CutInfoResponse;
import com._2.a401.moa.cut.service.CutService;
import com._2.a401.moa.cut.service.DrawingService;
import com._2.a401.moa.party.domain.Party;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.repository.PartyMemberRepository;
import com._2.a401.moa.party.repository.PartyRepository;
import com._2.a401.moa.schedule.domain.FullSessionStage;
import com._2.a401.moa.schedule.domain.Session;
import com._2.a401.moa.schedule.domain.SessionMember;
import com._2.a401.moa.schedule.dto.response.CurrentSessionStageResponse;
import com._2.a401.moa.schedule.dto.response.WsReadyStatusResponse;
import com._2.a401.moa.schedule.dto.response.WsSessionTransferResponse;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.repository.SessionMemberRedisRepository;
import com._2.a401.moa.schedule.repository.SessionRedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com._2.a401.moa.common.exception.ExceptionCode.INVALID_PARTY;
import static com._2.a401.moa.schedule.domain.FullSessionStage.WAITING;

@Slf4j
@RequiredArgsConstructor
@Service
public class SessionStageService {

    private final SessionRedisRepository sessionRedisRepository;
    private final SessionMemberRedisRepository sessionMemberRedisRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final ScheduleRepository scheduleRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final SessionMailService sessionMailService;
    private final TaskScheduler taskScheduler;
    private final DrawingService drawingService;
    private final PartyRepository partyRepository;
    private final SessionService sessionService;
    private final TransactionTemplate transactionTemplate;
    private final CutService cutService;

    public void dummyRedis(Long scheduleId, List<Long> memberIds) {
        final Session session = new Session(scheduleId, "openviduSessionId", WAITING, LocalDateTime.now());
        sessionRedisRepository.save(session);

        SessionMember sessionMember = new SessionMember(scheduleId);
        memberIds.forEach(memberId -> {
            sessionMember.addMember(memberId);
        });
        sessionMemberRedisRepository.save(sessionMember);

        setWaitingRoomTimer(scheduleId);
    }

    // 현재 세션 상태 얻어오기 - api (새로고침용)
    public CurrentSessionStageResponse getCurrentSessionStage(Long scheduleId) {
        Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
        log.info("세션 {}의 sessionRedisStage = {}", scheduleId, session.toString());
        return CurrentSessionStageResponse.from(session);
    }

    public void getDrawingReadyStatus(Long scheduleId) {
        log.info("[서버] 그림그리기 레디 상태 조회요청 날라옴");
        log.info("getDrawingReadyStatus : scheduleId={}", scheduleId);

        // Redis에서 sessionMember 불러오기
        SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        broadcastReadyStatus(scheduleId, sessionMember.getSessionMembers());
    }

    public void updateReadyStatus(Long scheduleId, Long memberId, boolean isReady) {
        //dummyRedis();
        log.info("[서버] 레디 요청 날라옴");
        log.info("updateReadyStatus: scheduleId={}, memberId={}", scheduleId, memberId);
        //sessionService.validateMemberPermission(memberId, scheduleId); // 권한 검증

        // Redis에서 sessionMember 불러오기
        SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        sessionMember.setReadyStatus(memberId, isReady); // 준비 상태 변경
        sessionMemberRedisRepository.save(sessionMember);

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
        if (nextSessionStage != FullSessionStage.TIMER_END) {
            setEndTimeTimer(scheduleId, now.plusSeconds(nextSessionStage.getDuration()), nextSessionStage);
        }

        //그림 그리기 끝난 후 svg export하기
        if(currentSessionStage == FullSessionStage.DRAWING) {
            log.info("next session: done(그림그리기 끝난 상태. 8분 뒤에 타이머 울림)");
            log.info("그림 그리기 끝남. export 시작");
            drawingService.exportSVG(scheduleId);
            log.info("export 완료");
        }

        // 세션 전환 메시지 생성
        WsSessionTransferResponse response = WsSessionTransferResponse.builder()
                .type("SESSION_TRANSFER")
                .currentSessionStage(currentSessionStage)
                .nextSessionStage(nextSessionStage)
                .sessionStartTime(now)
                .sessionDuration(nextSessionStage.getDuration()) // !!
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
                    log.info("타이머 완료!!!: scheduleId: {}", scheduleId);
                    if(expectedStage == FullSessionStage.DONE) {
                        log.info("next session: 없음(그림그리기 끝나고 8분 뒤(3분:그림감상/5분:퀴즈)의 상태.)");
                        handleSessionDone(scheduleId);
                    }else {
                        // 현재 세션 정보 조회
                        Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
                        log.info("session: {}", session.getSessionId());
                        FullSessionStage currentStage = session.getSessionStage();
                        log.info("session value: {}", String.valueOf(session));

                        // 예상했던 단계와 현재 단계가 같을 때만 전환
                        log.info("stage {} == {}??", currentStage, expectedStage);
                        if (currentStage == expectedStage) {
                            log.info("{} 에서 다음 단계로 이동~", expectedStage);
                            handleSessionTransfer(scheduleId);

                            if(currentStage == FullSessionStage.CUT_ASSIGN) { // CUT_ASSIGN 다음 단계인 DRAWING에서는
                                // ready를 요청하지 않았어도 현재 다른 사람들의 ready 정보가 필요
                                getDrawingReadyStatus(scheduleId);
                            }
                        }
                    }
                    log.info("next scheduler time: {}", endTime.atZone(ZoneId.systemDefault()).toInstant().toString());
                },
                endTime.atZone(ZoneId.systemDefault()).toInstant()
        );
    }

    // 외부(WaitingRoom)에서 호출할  최초 타이머(대기방에서 10분 뒤 울릴 알람) 설정
    public void setWaitingRoomTimer(Long scheduleId) {
        log.info("SessionStageService.setWaitingRoomTimer");
        Session session = sessionRedisRepository.fetchByScheduleId(scheduleId);
        FullSessionStage currentStage = session.getSessionStage();
        LocalDateTime startTime = session.getStartTime();
        log.info("일정 {} - 단계:{}, 시작시간:{}", scheduleId, currentStage, startTime);

        if (currentStage != FullSessionStage.DONE) {
            log.info("일정 {}의 타이머를 {}로 설정", scheduleId, startTime.plusSeconds(currentStage.getDuration()));
            setEndTimeTimer(
                    scheduleId, // 스케줄 아이디
                    startTime.plusSeconds(currentStage.getDuration()), // 타이머가 끝났으면 하는 시간
                    currentStage // 타이머를 호출하는 현재 시점의 단계
            );
        }
    }

    public void quizDone(Long scheduleId, Long memberId) { // 퀴즈 완료 api
        SessionMember sessionMember = sessionMemberRedisRepository.fetchByScheduleId(scheduleId);
        sessionMember.addQuizDoneMember(memberId);
        sessionMemberRedisRepository.save(sessionMember);
    }

    public void handleUncompletedQuizMembers(Long scheduleId) {
        Long partyId = scheduleRepository.findPartyIdById(scheduleId)
                .orElseThrow(() -> new MoaException(ExceptionCode.SCHEDULE_NOT_ACTIVE));

        // 1. 파티에 참여중인 모든 아이들 정보
        List<Long> allPartyMembers = partyMemberRepository.findMemberIdsByPartyId(partyId);
        // 2. Redis에서 퀴즈 완료 체크한 아이들 정보
        Map<Long, Boolean> quizDoneMembers = sessionMemberRedisRepository.fetchByScheduleId(scheduleId)
                .getQuizDoneMembers();

        // 3. = 1-2 하면 퀴즈에 참여 안한 아이들
        List<Long> uncompletedMembers = allPartyMembers.stream()
                .filter(memberId -> !quizDoneMembers.getOrDefault(memberId, false)) // 해당 조건이 true인 애들만 선택됨
                .toList();

        if (!uncompletedMembers.isEmpty()) {
            sessionMailService.sendBadChildNotice(uncompletedMembers); // 세션에 끝까지 참여안한 아이들 알림보내기
        }
    }

    // 세션 종료되었을 때 실행되는 작업들
    private void handleSessionDone(Long scheduleId) {

        // 필요없는 컷 redis 데이터 삭제
        cutService.deleteTempCanvasData(scheduleId);

        // 1. 퀴즈 참여 안한 인원에게 메일 보냄
        handleUncompletedQuizMembers(scheduleId);

        transactionTemplate.execute(tx -> {
            sessionService.close(scheduleId);

            // 3. Party 상태 변경
            scheduleRepository.findPartyIdById(scheduleId)
                .ifPresent(partyId -> { // schedule_id로 party_id 찾아옴

                    // Party의 progerss_count를 1 증가시키기, 만약 마지막 세션이었다면 1증가가 아니라 DONE으로 변경
                    Party party = partyRepository.findById(partyId)
                        .orElseThrow(() -> new MoaException(INVALID_PARTY));

                    // Party 진행도 증가
                    party.setProgressCount(party.getProgressCount()+1);

                    // 마지막 세션이면 Party 상태를 DONE으로 변경
                    if (party.getProgressCount() >= party.getEpisodeCount()) {
                        party.setStatus(PartyState.DONE);
                    }
                });
            return null;
        });
    }

}