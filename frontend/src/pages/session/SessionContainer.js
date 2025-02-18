import React, { useState, useEffect, useRef } from 'react';
import WaitingRoom from './WaitingRoom';
import WordLearning from './WordLearning';
import RandomPage from '../RandomPage';
import DrawingPage from '../draw/DrawingPage';
import DrawingEndPage from '../draw/DrawingEndPage';
import QuizPage from './QuizPage';
import QuizEndPage from './QuizEndPage';
import { useSessionStageWebSocket } from '../../hooks/useSessionStageWebSocket';
import { getCurrentSessionStage } from '../../api/sessionStage';
import { useNavigate, useParams } from 'react-router';
import { SessionProvider } from '../../hooks/SessionProvider';
import FullPage from './FullPage';
import useOpenViduSession from '../../hooks/useOpenViduSession';
import { getEBookCover } from '../../api/book';
import { getSessionInfoByPinNumber } from '../../api/schedule';
import { useDispatch } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';

const SessionContainer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const { pinNumber } = useParams(); // 프론트 url에 담겨서 옴
    const [isFullScreen, setIsFullScreen] = useState(true); // 화면이 전체화면인지 여부
    const [bookInfo, setBookInfo] = useState(null); // api로 정보 가져옴 {partyId, bookTitle, bookCover, cuts: Array(4)}
    const sessionData = useRef({
        // api로 정보 가져옴
        scheduleId: null,
        partyId: null,
    });
    const [sessionStageData, setSessionStageData] = useState({
        currentStage: 'NONE',
        sessionStartTime: new Date(Date.now() - 9 * 60 * 1000),
        serverTime: new Date(),
        sessionDuration: 60,
    });
    const { session, publisher, subscribers, nickname, joinSession, leaveSession } = useOpenViduSession();
    const { sendReady, readyStatusResponse, sessionTransferResponse, isConnected } = useSessionStageWebSocket(
        sessionData.current.scheduleId,
    );

    useEffect(() => {
        if (sessionData.current.scheduleId) {
            console.log(fetchCutsInfo(sessionData.current.scheduleId));
            dispatch(fetchCutsInfo(sessionData.current.scheduleId)); // API 호출
        }
    }, [dispatch, sessionData.current.scheduleId]);

    useEffect(() => {
        console.log('세션 변경 감지');
        if (sessionTransferResponse?.nextSessionStage) {
            setSessionStageData(prev => ({
                currentStage: sessionTransferResponse.nextSessionStage,
                sessionStartTime: sessionTransferResponse.sessionStartTime,
                serverTime: sessionTransferResponse.severTime,
                sessionDuration: sessionTransferResponse.sessionDuration,
            }));
        }
    }, [sessionTransferResponse]);

    useEffect(() => {
        const handleBeforeUnload = event => {
            event.preventDefault();
            event.returnValue = '정말 페이지를 나가시겠습니까?? 변경사항이 저장되지 않을 수 있습니다.';
        };

        const blockReload = event => {
            if (event.key === 'F5' || (event.ctrlKey && event.key === 'r') || (event.metaKey && event.key === 'r')) {
                event.preventDefault();
                alert('새로고침이 차단되었습니다.');
            }
        };

        const blockContextMenu = event => {
            event.preventDefault();
        };

        const checkWindowSize = () => {
            if (window.innerWidth < 800 || window.innerHeight < 600) {
                setIsFullScreen(false);
            } else {
                setIsFullScreen(true);
            }
        };

        checkWindowSize(); // 컴포넌트 마운트 시 크기 확인
        window.addEventListener('resize', checkWindowSize); // 크기 변경 시 체크
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('keydown', blockReload);
        window.addEventListener('contextmenu', blockContextMenu);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', blockReload);
            window.removeEventListener('contextmenu', blockContextMenu);
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);

    useEffect(async () => {
        setIsLoading(true);

        try {
            const data = await getSessionInfoByPinNumber(pinNumber);
            console.log(data);
            sessionData.current = {
                scheduleId: data.scheduleId,
                partyId: data.partyId,
            };

            const bookCoverData = await getEBookCover(sessionData.current.partyId);
            console.log('SessionContainer: getEBookCover:', bookCoverData);
            setBookInfo(bookCoverData);

            await joinSession(sessionData.current.scheduleId);
        } catch (error) {
            console.error('핀넘버로 세션 정보 조회 실패:', error);
            navigate('/home');
        }

        try {
            const response = await getCurrentSessionStage(sessionData.current.scheduleId);
            if (response.status === 200) {
                if (
                    response.data.currentSessionStage === 'DONE' ||
                    response.data.currentSessionStage === 'NONE' ||
                    response.data.currentSessionStage === 'INVALID_STAGE'
                ) {
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
            console.log('sessionStageData', sessionStageData);
        }

        return () => leaveSession().then(navigate('/home'));
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
            currentStage: 'QUIZ_END',
        }));
    };

    const handleLeaveSession = async () => {
        await leaveSession().then(navigate('/home'));
    };

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
                        scheduleId={sessionData.current.scheduleId}
                        sessionTime={sessionStageData.sessionStartTime}
                        serverTime={sessionStageData.serverTime}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                        sessionDuration={sessionStageData.sessionDuration}
                        leaveSession={handleLeaveSession}
                    />
                );
            case 'WORD':
                return (
                    <WordLearning
                        partyId={sessionData.current.partyId}
                        sessionStageData={sessionStageData}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                        sendReady={sendReady}
                    />
                );
            case 'CUT_ASSIGN':
                return <RandomPage sessionStageData={sessionStageData} />;
            case 'DRAWING':
                return (
                    <DrawingPage
                        scheduleId={sessionData.current.scheduleId}
                        sessionStageData={sessionStageData}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                        sendReady={sendReady}
                        readyStatusResponse={readyStatusResponse}
                    />
                );
            case 'DONE':
                return (
                    <DrawingEndPage
                        scheduleId={sessionData.current.scheduleId}
                        sessionStageData={sessionStageData}
                        onTimeout={handleDrawingTimeout}
                        publisher={publisher}
                        subscribers={subscribers}
                        nickname={nickname}
                    />
                );
            case 'QUIZ':
                return (
                    <QuizPage
                        partyId={sessionData.partyId}
                        scheduleId={sessionData.scheduleId}
                        onChangeStage={handleQuizTimeout}
                    />
                );
            case 'QUIZ_END':
                return <QuizEndPage />;
            default:
                //navigate('/home');
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
        if (isLoading || !sessionData.current) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <p>로딩 중...</p>
                </div>
            );
        }
        return renderStage();
    };

    return (
        <div className="min-h-screen relative">
            {renderStage()}
            {!isFullScreen && <FullPage />}
        </div>
    );
};

export default SessionContainer;
