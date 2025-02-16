import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';
import Overview from '../../components/draw/Overview';
import Drawing from '../../components/draw/Drawing';
import Navigation from '../../components/Navigation';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';
import { useSession } from '../../hooks/SessionProvider';

const DrawingPage = ({ sessionStageData, publisher, subscribers, nickname, sendReady, readyStatusResponse }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const scheduleId = 1;

    //redux 상태 가져오기
    const cutsState = useSelector(state => state.cuts);

    const userId = useSelector(state => state.user.userInfo.id);

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

        // Cleanup function to handle component unmounting
        return () => {
            console.log('Drawing 페이지 종료됨');
            handlePageExit(); // 페이지 종료 시 함수 호출
        };
    }, [dispatch, scheduleId]);

    const handleTimeOut = async () => {
        setIsLoading(true);
        if (drawingRef.current) {
            console.log('exportToSVGAndUpload 함수 호출??');
            await drawingRef.current.exportToSVGAndUpload(); // Drawing의 함수 호출
        }
        setIsLoading(false);

        //navigate('/session/draw-end', { state: { scheduleId } });
    };

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
