import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';
import Overview from '../../components/draw/Overview';
import Drawing from '../../components/draw/Drawing';
import Navigation from '../../components/Navigation';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';
import { useSession } from '../../hooks/SessionProvider';
import { authInstance } from '../../api/axios';
import { setLines } from '../../store/canvasSlice';

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
    const drawingRef = useRef(null);

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

    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="w-full mb-5">
                <Navigation
                    stage="drawing"
                    stageDuration={sessionStageData.sessionDuration}
                    sessionStartTime={sessionStageData.sessionStartTime}
                    serverTime={sessionStageData.serverTime}
                    onTimeOut={handleTimeOut}
                />
            </div>
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
            {/* Export SVG 버튼
            <div className="flex justify-center mt-5">
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                    onClick={handleExportSVG} // exportToSVGAndUpload 호출
                >
                    SVG 내보내기 확인
                </button>
            </div> */}
        </div>
    );
};

export default DrawingPage;
