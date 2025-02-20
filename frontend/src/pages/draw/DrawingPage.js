import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';
import Overview from '../../components/draw/Overview';
import Drawing from '../../components/draw/Drawing';
import Navigation from '../../components/Navigation';
import Loading from '../../components/Loading';
import { authInstance } from '../../api/axios';
import { setLines } from '../../store/canvasSlice';
import TimeNotification from '../../components/time/TimeNotification';

const DrawingPage = ({
    scheduleId,
    sessionStageData,
    publisher,
    subscribers,
    nickname,
    sendReady,
    readyStatusResponse,
}) => {
    const dispatch = useDispatch();

    //redux 상태 가져오기
    const cutsState = useSelector(state => state.cuts);

    const userId = useSelector(state => state.user.userInfo.id);
    const cutId = cutsState.cuts.find(item => item.memberId === userId)?.cutId;

    const [isDrawing, setIsDrawing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstDrawingVisit, setIsFirstDrawingVisit] = useState(true);
    const [isFirstOverviewVisit, setIsFirstOverviewVisit] = useState(true);
    const [timeNotification, setTimeNotification] = useState(null);
    const drawingRef = useRef(null);

    const handleTimeNotification = (timeLeft) => {
        let message = '';
        
        if (timeLeft === 'TEN_LEFT') {
            message = '10분 남았어!';
        } else if (timeLeft === 'FIVE_LEFT') {
            message = '5분 남았어!';
        } else if (timeLeft === 'ONE_LEFT') {
            message = '1분 남았어!';
        }
        
        if (message) {
            setTimeNotification(message);
            
            // 10초 후에 알림 제거
            setTimeout(() => {
                setTimeNotification(null);
            }, 10000);
        }
    };

    const toggleView = () => {
        setIsDrawing(prev => !prev);
    };

    useEffect(() => {
        if (scheduleId) {
            dispatch(fetchCutsInfo(scheduleId)); // API 호출
        }

        // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
        return () => {
            console.log('Drawing 페이지 종료됨');
        };
    }, [dispatch, scheduleId]);

    const handleTimeOut = async () => {};

    const { lines, undoneLines } = useSelector(state => state.canvas);

    useEffect(() => {
        const fetchCanvasData = async () => {
            try {
                const response = await authInstance.get(`/cuts/${cutId}`);
                if (response.status !== 200) throw new Error('캔버스 데이터 조회 실패');

                const data = response.data;
                if (data.canvasData) {
                    const parsedData = JSON.parse(data.canvasData);
                    dispatch(setLines(parsedData)); // 저장된 데이터를 캔버스에 반영
                }
            } catch (error) {
                console.error('캔버스 데이터를 불러오는 중 오류 발생:', error);
            }
        };

        fetchCanvasData();
    }, [cutId]);

    const handlePageExit = async () => {
        setIsLoading(true);
        console.log('handlePageExit');
        if (drawingRef.current) {
            console.log('exportToSVGAndUpload 함수 호출??');
            await drawingRef.current.exportToSVGAndUpload(); // Drawing의 함수 호출
        }
        setIsLoading(false);
    };

    // 추가된 버튼을 통한 exportToSVGAndUpload 확인
    const handleExportSVG = () => {
        if (drawingRef.current) {
            console.log('exportToSVGAndUpload 버튼 클릭됨');
            drawingRef.current.exportToSVGAndUpload();
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-light-cream-yellow">
            <Navigation
                stage="drawing"
                onTimeNotification={handleTimeNotification}
                stageDuration={sessionStageData.sessionDuration}
                sessionStartTime={sessionStageData.sessionStartTime}
                serverTime={sessionStageData.serverTime}
                onTimeOut={handleTimeOut}
            />
            
            <div className="h-[calc(100vh-64px)] -mt-6">
                {cutsState.loading && <p>Loading...</p>}
                {cutsState.error && <p>Error: {cutsState.error}</p>}
                {!cutsState.loading &&
                    !cutsState.error &&
                    cutsState.cuts.length > 0 &&
                    (isDrawing ? (
                        <Drawing
                            ref={drawingRef}
                            toggleView={toggleView}
                            cutsInfo={cutsState.cuts}
                            userId={userId}
                            sendReady={sendReady}
                            publisher={publisher}
                            nickname={nickname}
                            isFirstDrawingVisit={isFirstDrawingVisit}
                            setIsFirstDrawingVisit={setIsFirstDrawingVisit}
                        />
                    ) : (
                        <Overview
                            toggleView={toggleView}
                            cutsInfo={cutsState.cuts}
                            subscribers={subscribers}
                            publisher={publisher}
                            nickname={nickname}
                            isFirstOverviewVisit={isFirstOverviewVisit}
                            setIsFirstOverviewVisit={setIsFirstOverviewVisit}
                            readyStatusResponse={readyStatusResponse}
                        />
                    ))}
                {isLoading && <Loading />}
                {timeNotification && <TimeNotification message={timeNotification} />}
            </div>
        </div>
    );
};

export default DrawingPage;