import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';
import Overview from '../../components/draw/Overview';
import Drawing from '../../components/draw/Drawing';
import Navigation from '../../components/Navigation';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';
import { useSession } from '../../hooks/SessionProvider';

const DrawingPage = ({ scheduleId, sessionStageData, publisher, subscribers, nickname, sendReady, readyStatusResponse }) => {
    const dispatch = useDispatch();

    //redux 상태 가져오기
    const cutsState = useSelector(state => state.cuts);

    // TODO: 위에껄로 바꿔야함
    // const userId = useSelector(state => state.user.userInfo.id);
    const userId = 3;

    useEffect(() => {
        if (scheduleId) {
            dispatch(fetchCutsInfo(scheduleId)); // API 호출
        }
    }, [dispatch, scheduleId]);

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
            const handlePageExit = async () => {
                setIsLoading(true);
                console.log('handlePageExit');
                console.log(drawingRef.current);
                if (drawingRef.current) {
                    console.log('exportToSVGAndUpload 함수 호출??');
                    await drawingRef.current.exportToSVGAndUpload(); // Drawing의 함수 호출
                }
                setIsLoading(false);
            };

            // Call the async function
            handlePageExit();
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
                        sendReady = {sendReady}
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
                        readyStatusResponse = {readyStatusResponse}
                    />
                ))}
            {isLoading && <Loading />}
        </div>
    );
};

export default DrawingPage;
