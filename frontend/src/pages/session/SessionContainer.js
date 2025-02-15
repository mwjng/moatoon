import React, { useState, useEffect } from 'react';
import WaitingRoom from './WaitingRoom';
import WordLearning from './WordLearning';
import RandomPage from '../RandomPage';
import DrawingPage from '../draw/DrawingPage';
import DrawingEndPage from '../draw/DrawingEndPage';
import QuizPage from './QuizPage';
import { useSessionStageWebSocket } from '../../hooks/useSessionStageWebSocket';
import { getCurrentSessionStage } from '../../api/sessionStage';
import { useNavigate } from 'react-router';
import { SessionProvider } from '../../hooks/SessionProvider';

import useOpenViduSession from '../../hooks/useOpenViduSession';

const SessionContainer = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [sessionData, setSessionData] = useState({
        scheduleId: 1,
        partyId: 1,
        bookTitle: '용감한 기사',
    });

    const [sessionStageData, setSessionStageData] = useState({
        currentStage: 'NONE',
        sessionStartTime: new Date(Date.now() - 9 * 60 * 1000),
        serverTime: new Date(),
        sessionDuration: 60,
    });

    const scheduleId = 12;

    // useOpenViduSession 훅 사용
    const { session, publisher, subscribers, nickname, joinSession, leaveSession } = useOpenViduSession(scheduleId);

    // 컴포넌트 마운트될 때 세션 참여
    useEffect(() => {
        joinSession();
        return () => leaveSession(); // 컴포넌트 언마운트 시 세션 나가기
    }, []);

    // 초기 세션 스테이지 정보를 가져오는 함수
    const fetchCurrentStage = async () => {
        setIsLoading(true);
        try {
            const response = await getCurrentSessionStage(sessionData.scheduleId);
            if (response.status === 200) {
                if (response.data.currentSessionStage === 'DONE') {
                    // 새로고침했을때 DONE이면 접근 금지
                    navigate('/home');
                    return;
                }

                console.log('세션 stage 조회 요청 성공(값): ', response.data);
                setSessionStageData({
                    currentStage: response.data.currentSessionStage,
                    sessionStartTime: new Date(response.data.sessionStageStartTime),
                    serverTime: new Date(response.data.serverTime),
                    sessionDuration: response.data.sessionDuration,
                });
            }
        } catch (error) {
            console.error('현재 세션 스테이지 조회 실패:', error);
            navigate('/home');
        } finally {
            setIsLoading(false);
        }
    };

    // 타임아웃 처리 함수
    const handleTimeout = () => {
        console.log('타임아웃 처리: QUIZ 스테이지로 전환');
        setSessionStageData(prev => ({
            ...prev,
            currentStage: 'QUIZ',
        }));
    };

    // 초기 로딩 시 스테이지 정보 가져오기
    useEffect(() => {
        fetchCurrentStage();
    }, [sessionData.scheduleId]);

    // 상태 업데이트를 확인하기 위한 별도의 useEffect
    useEffect(() => {
        console.log('세션 stage 업데이트됨: ', sessionStageData);
        renderStage();
    }, [sessionStageData]);

    const { sendReady, readyStatusResponse, sessionTransferResponse, isConnected } = useSessionStageWebSocket(
        sessionData.scheduleId,
    );

    // sessionTransferResponse 변경시 stage 업데이트
    useEffect(() => {
        if (sessionTransferResponse?.nextSessionStage) {
            setSessionStageData(prev => ({
                currentStage: sessionTransferResponse.nextSessionStage,
                sessionStartTime: sessionTransferResponse.sessionStartTime,
                serverTime: sessionTransferResponse.severTime,
                sessionDuration: sessionTransferResponse.sessionDuration,
            }));
        }
    }, [sessionTransferResponse]);

    const renderStage = () => {
        console.log('=========[SessionContainer의 renderStage => WaitingRoom]===============');
        console.log(`sessionStageData:`, JSON.stringify(sessionStageData));
        // 이전 스테이지와 현재 스테이지가 같으면 렌더링하지 않음
        if (sessionTransferResponse?.currentSessionStage === sessionStageData.currentStage) {
            console.log('현재 스테이지와 동일하여 렌더링 스킵');
            return null;
        }
        switch (sessionStageData.currentStage) {
            case 'WAITING':
                return (
                    <WaitingRoom
                        scheduleId={sessionData.scheduleId}
                        bookTitle={sessionData.bookTitle}
                        sessionTime={sessionStageData.sessionStartTime}
                        serverTime={sessionStageData.serverTime}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                        sessionDuration={sessionStageData.sessionDuration}
                    />
                );
            case 'WORD':
                return (
                    <WordLearning
                        sessionStageData={sessionStageData}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                    />
                );
            case 'CUT_ASSIGN':
                return <RandomPage sessionStageData={sessionStageData} />;
            case 'DRAWING':
                return (
                    <DrawingPage
                        sessionStageData={sessionStageData}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                    />
                );
            case 'DONE':
                return (
                    <DrawingEndPage
                        sessionStageData={sessionStageData}
                        onTimeout={handleTimeout}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                    />
                );
            case 'QUIZ':
                return <QuizPage />;
            default:
                navigate('/home');
                return null;
        }
    };

    // 만약 웹소켓 연결이 끊어졌다면 재연결 시도
    useEffect(() => {
        if (!isConnected) {
            console.log('웹소켓 연결 끊김. 재연결 시도...');
        }
    }, [isConnected]);

    const CurrentStage = () => {
        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <p>로딩 중...</p>
                </div>
            );
        }
        return renderStage();
    };

    return (
        <div className="min-h-screen">
            <CurrentStage />
        </div>
    );
};

export default SessionContainer;
