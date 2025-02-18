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
    const [isLoading, setIsLoading] = useState(true);
    const { pinNumber } = useParams(); // 프론트 url에 담겨서 옴

    const [isFullScreen, setIsFullScreen] = useState(true); // 화면이 전체화면인지 여부

    const [bookInfo, setBookInfo] = useState(null); // api로 정보 가져옴 {partyId, bookTitle, bookCover, cuts: Array(4)}
    const sessionData = useRef({
        // api로 정보 가져옴
        scheduleId: null,
        partyId: null,
    });

    const { session, publisher, subscribers, nickname, joinSession, leaveSession } = useOpenViduSession();

    const [sessionStageData, setSessionStageData] = useState({
        currentStage: 'NONE',
        sessionStartTime: new Date(Date.now() - 9 * 60 * 1000),
        serverTime: new Date(),
        sessionDuration: 60,
    });

    //창 크기 체크 함수
    const checkWindowSize = () => {
        if (window.innerWidth < 800 || window.innerHeight < 600) {
            setIsFullScreen(false);
        } else {
            setIsFullScreen(true);
        }
    };

    useEffect(() => {
        checkWindowSize(); // 컴포넌트 마운트 시 크기 확인
        window.addEventListener('resize', checkWindowSize); // 크기 변경 시 체크

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);

    // 컴포넌트 마운트될 때 세션 참여
    // ===========[api 호출]==========
    // pinNumber로 초기 데이터 가져오기
    useEffect(() => {
        const fetchSessionInfo = async () => {
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
        };

        if (pinNumber) {
            console.log(pinNumber);
            fetchSessionInfo();
        }

        return () => leaveSession();
    }, [pinNumber, navigate]);

    // partyId로 bookTitle, bookCover, cuts 가져옴
    // useEffect(() => {
    //     const fetchCover = async () => {
    //         try {
    //             const data = await getEBookCover(sessionData.partyId);
    //             console.log('SessionContainer: getEBookCover:', data);
    //             setBookInfo(data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     fetchCover();
    // }, [sessionData.partyId]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (sessionData.scheduleId) {
            dispatch(fetchCutsInfo(sessionData.scheduleId)); // API 호출
        }
    }, [dispatch, sessionData.scheduleId]);

    // 초기 로딩 시 스테이지 정보 가져오기
    useEffect(() => {
        if (sessionData.current.scheduleId) {
            // 여기서 scheduleId 체크
            fetchCurrentStage();
        }
    }, [sessionData.current.scheduleId]); // sessionData.scheduleId가 변경될 때만 실행

    // 초기 세션 스테이지 정보를 가져오는 함수
    const fetchCurrentStage = async () => {
        setIsLoading(true);
        try {
            const response = await getCurrentSessionStage(sessionData.current.scheduleId);
            if (response.status === 200) {
                if (response.data.currentSessionStage === 'DONE') {
                    // 새로고침했을때 DONE이면 접근 금지
                    navigate('/home');
                    return;
                }

                console.log('세션 stage 조회 요청 성공(값): ', response.data);
                setSessionStageData({
                    currentStage: response.data.currentSessionStage,
                    sessionStartTime: new Date(
                        new Date(response.data.sessionStageStartTime).getTime() + 9 * 60 * 60 * 1000,
                    ),
                    serverTime: new Date(new Date(response.data.serverTime).getTime() + 9 * 60 * 60 * 1000),
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
    };

    // ===========[api 호출 끝]==========

    // useOpenViduSession 훅 사용
    // const { session, publisher, subscribers, nickname, joinSession, leaveSession } = useOpenViduSession(
    //     sessionData.current.scheduleId,
    // );

    // 컴포넌트 마운트될 때 세션 참여
    // useEffect(() => {
    //     joinSession();
    //     return () => leaveSession(); // 컴포넌트 언마운트 시 세션 나가기
    // }, []);

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

    // 상태 업데이트를 확인하기 위한 별도의 useEffect
    // useEffect(() => {
    //     console.log("세션 stage 업데이트됨: ", sessionStageData);
    //     renderStage();
    // }, [sessionStageData]);

    const { sendReady, readyStatusResponse, sessionTransferResponse, isConnected } = useSessionStageWebSocket(
        sessionData.current.scheduleId,
    );

    // sessionTransferResponse 변경시 stage 업데이트
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
        if (sessionStageData.currentStage === 'NONE' || sessionStageData.currentStage === 'INVALID_STAGE') {
            navigate('/home');
        }
    }, [sessionStageData.currentStage, navigate]);

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

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('keydown', blockReload);
        window.addEventListener('contextmenu', blockContextMenu);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', blockReload);
            window.removeEventListener('contextmenu', blockContextMenu);
        };
    }, []);

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
