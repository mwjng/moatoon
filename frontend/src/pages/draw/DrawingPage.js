import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';
import Overview from '../../components/draw/Overview';
import Drawing from '../../components/draw/Drawing';
import Navigation from '../../components/Navigation';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';

const DrawingPage = ({sessionStageData}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const scheduleId = 1;

    //redux 상태 가져오기
    const cutsState = useSelector(state => state.cuts);
    // const userId = useSelector(state => state.user.userInfo.id);
    const userId = 3;
    useEffect(() => {
        if (scheduleId) {
            dispatch(fetchCutsInfo(scheduleId)); // API 호출
        }
    }, [dispatch, scheduleId]);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const drawingRef = useRef(null);

    const toggleView = () => {
        setIsDrawing(prev => !prev);
    };

    const handleTimeOut = async () => {
        setIsLoading(true);
        if (drawingRef.current) {
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
                    onTimeOut={handleTimeOut} />
            </div>
            {cutsState.loading && <p>Loading...</p>}
            {cutsState.error && <p>Error: {cutsState.error}</p>}
            {!cutsState.loading &&
                !cutsState.error &&
                cutsState.cuts.length > 0 &&
                (isDrawing ? (
                    <Drawing ref={drawingRef} toggleView={toggleView} cutsInfo={cutsState.cuts} userId={userId} />
                ) : (
                    <Overview toggleView={toggleView} cutsInfo={cutsState.cuts} />
                ))}
            {isLoading && <Loading />}
        </div>
    );
};

export default DrawingPage;
