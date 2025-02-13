import React, { useState, useEffect } from 'react';
import WaitingRoom from './WaitingRoom';
import WordLearning from './WordLearning';
import CutAllPage from '../draw/CutAllPage';
import DrawingPage from '../draw/DrawingPage';
import DrawingEndPage from '../draw/DrawingEndPage';
import QuizPage from './QuizPage';
import { useSessionStageWebSocket } from '../../hooks/useSessionStageWebSocket';


const SessionContainer = () => {
    const [currentStage, setCurrentStage] = useState('WAITING'); // 초기 페이지는 WAITING
    const [sessionData, setSessionData] = useState({
        scheduleId: 1,
        partyId: 1,
        bookTitle: '용감한 기사',
        sessionTime: new Date(Date.now() - 9 * 60 * 1000), // 9분을 밀리초로 변환하여 뺌, // TODO: 이걸 session시작 시간으로 가져오면, 새로고침해도 타이머 10분 갱신 안됨.
        serverTime: new Date()
    });

    // 웹소켓 연결 사용
    const { 
        sendReady, 
        readyStatusResponse, 
        sessionTransferResponse, 
        isConnected 
    } = useSessionStageWebSocket(sessionData.scheduleId);

    // sessionTransferResponse 변경시 stage 업데이트
    useEffect(() => {
        if (sessionTransferResponse?.nextSessionStage) {
            setCurrentStage(sessionTransferResponse.nextSessionStage);
        }
    }, [sessionTransferResponse]);


    const renderStage = () => {
        console.log("화면 전환!!")
        console.log(currentStage)
        switch (currentStage) {
            case 'WAITING':
                console.log(sessionData);
                return (
                    <WaitingRoom 
                        scheduleId={sessionData.scheduleId}
                        bookTitle={sessionData.bookTitle}
                        sessionTime={sessionData.sessionTime}
                        serverTime ={sessionData.serverTime}
                    />
                );
            case 'WORD':
                return (
                    <WordLearning
                    sessionTransferResponse={sessionTransferResponse}
                     />
                );
            case 'DRAWING':
                return (
                    <CutAllPage 
                    sessionTransferResponse={sessionTransferResponse}
                    />
                );
            case 'DONE':
                return (
                    <DrawingEndPage 
                    sessionTransferResponse={sessionTransferResponse}
                    />
                );
            default:
                return null;
        }
    };

    // 만약 웹소켓 연결이 끊어졌다면 재연결 시도
    useEffect(() => {
        if (!isConnected) {
            // 웹소켓 재연결 로직
            console.log('웹소켓 연결 끊김. 재연결 시도...');
        }
    }, [isConnected]);

    return (
        <div className="min-h-screen">
            {renderStage()}
        </div>
    );
};

export default SessionContainer;