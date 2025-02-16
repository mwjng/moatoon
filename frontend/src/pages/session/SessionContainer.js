import React, { useState, useEffect } from 'react';
import WaitingRoom from './WaitingRoom';
import WordLearning from './WordLearning';
import RandomPage from '../RandomPage';
import DrawingPage from '../draw/DrawingPage';
import DrawingEndPage from '../draw/DrawingEndPage';
import QuizPage from './QuizPage';
import QuizEndPage from './QuizEndPage';
import { useSessionStageWebSocket } from '../../hooks/useSessionStageWebSocket';
import { getCurrentSessionStage } from '../../api/sessionStage';
import { useNavigate, useParams  } from 'react-router';
import useOpenViduSession from '../../hooks/useOpenViduSession';
import { getEBookCover } from '../../api/book';
import { getSessionInfoByPinNumber } from '../../api/schedule';

const SessionContainer = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { pinNumber } = useParams();  // 프론트 url에 담겨서 옴

    const [bookInfo, setBookInfo] = useState(null); // api로 정보 가져옴 {partyId, bookTitle, bookCover, cuts: Array(4)}
    const [sessionData, setSessionData] = useState({ // api로 정보 가져옴
        scheduleId: null,
        partyId: null
    });
    
    const [sessionStageData, setSessionStageData] = useState({
        currentStage: 'NONE',
        sessionStartTime: new Date(Date.now() - 9 * 60 * 1000),
        serverTime: new Date(),
        sessionDuration: 60,
    });


    // ===========[api 호출]==========
    // pinNumber로 초기 데이터 가져오기
    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                const data = await getSessionInfoByPinNumber(pinNumber);
                setSessionData({
                    scheduleId: data.scheduleId,
                    partyId: data.partyId
                });
            } catch (error) {
                console.error('핀넘버로 세션 정보 조회 실패:', error);
                navigate('/home');
            }
        };

        if (pinNumber) {
            fetchSessionInfo();
        }
    }, [pinNumber, navigate]);

    // partyId로 bookTitle, bookCover, cuts 가져옴
    useEffect(() => {
        const fetchCover = async () => {
            try {
                const data = await getEBookCover(sessionData.partyId);
                console.log('SessionContainer: getEBookCover:', data);
                setBookInfo(data);
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchCover();
    }, [sessionData.partyId]);

    // 초기 로딩 시 스테이지 정보 가져오기
    useEffect(() => {
    if (sessionData.scheduleId) {  // 여기서 scheduleId 체크
        fetchCurrentStage();
    }
    }, [sessionData.scheduleId]);  // sessionData.scheduleId가 변경될 때만 실행

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
    
     // ===========[api 호출 끝]==========

    // useOpenViduSession 훅 사용
    const { session, publisher, subscribers, nickname, joinSession, leaveSession } = useOpenViduSession(sessionData.scheduleId);

    // 컴포넌트 마운트될 때 세션 참여
    useEffect(() => {
        joinSession();
        return () => leaveSession(); // 컴포넌트 언마운트 시 세션 나가기
    }, []);

    // 타임아웃 처리 함수
    const handleDrawingTimeout = () => {
        console.log('타임아웃 처리: QUIZ 스테이지로 전환');
        setSessionStageData(prev => ({
            ...prev,
            currentStage: 'QUIZ',
        }));
    };

    const handleQuizTimeout = () => {
        console.log('타임아웃 처리: 퀴즈종료료 스테이지로 전환');
        setSessionStageData(prev => ({
            ...prev,
            currentStage: 'QUIZ_END'
        }));
    };

    // 상태 업데이트를 확인하기 위한 별도의 useEffect
    // useEffect(() => {
    //     console.log("세션 stage 업데이트됨: ", sessionStageData);
    //     renderStage();
    // }, [sessionStageData]);

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
        // 이전 스테이지와 현재 스테이지가 같으면 렌더링하지 않음
        if (sessionTransferResponse?.currentSessionStage === sessionStageData.currentStage) {
            return null;
        }
        switch (sessionStageData.currentStage) {
            case 'WAITING':
                return (
                    <WaitingRoom
                        bookInfo={bookInfo}
                        scheduleId={sessionData.scheduleId}
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
                        partyId = {sessionData.partyId}
                        sessionStageData={sessionStageData}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                        sendReady = {sendReady}
                    />
                );
            case 'CUT_ASSIGN':
                return <RandomPage sessionStageData={sessionStageData} />;
            case 'DRAWING':
                return (
                    <DrawingPage
                        scheduleId = {sessionData.scheduleId}
                        sessionStageData={sessionStageData}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                        sendReady = {sendReady}
                        readyStatusResponse = {readyStatusResponse}
                    />
                );
            case 'DONE':
                return (
                    <DrawingEndPage
                        scheduledId = {sessionData.scheduleId}
                        sessionStageData={sessionStageData}
                        onTimeout={handleDrawingTimeout}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                    />
                );
            case 'QUIZ':
                return(
                    <QuizPage
                    partyId={sessionData.partyId}
                    onChangeStage={handleQuizTimeout}/>
                );
            case 'QUIZ_END':
                return(
                    <QuizEndPage/>
                );
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
