import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';
import Overview from '../../components/draw/Overview';
import Drawing from '../../components/draw/Drawing';
import Navigation from '../../components/Navigation';
import { useNavigate, useParams } from 'react-router-dom';

const DrawingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const scheduleId = 12;

    //redux 상태 가져오기
    const cutsState = useSelector(state => state.cuts);

    useEffect(() => {
        if (scheduleId) {
            dispatch(fetchCutsInfo(scheduleId)); // API 호출
        }
    }, [dispatch, scheduleId]);

    const [isDrawing, setIsDrawing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const drawingRef = useRef(null);

    const toggleView = () => {
        setIsDrawing(prev => !prev);
    };

    const handleTimeOut = () => {
        if (drawingRef.current) {
            drawingRef.current.exportToSVGAndUpload(); // Drawing의 함수 호출
        }
        navigate('/session/draw-end', { state: { scheduleId } });
    };

    // 로딩 상태 관리
    const handleLoadingState = state => {
        setIsLoading(state); // 로딩 상태 변경
    };

    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="w-full mb-5">
                <Navigation stage="drawing" onTimeOut={handleTimeOut} />
            </div>
            {cutsState.loading && <p>Loading...</p>}
            {cutsState.error && <p>Error: {cutsState.error}</p>}
            {!cutsState.loading &&
                !cutsState.error &&
                cutsState.cuts.length > 0 &&
                (isDrawing ? (
                    <Drawing ref={drawingRef} toggleView={toggleView} cutsInfo={cutsState.cuts} />
                ) : (
                    <Overview toggleView={toggleView} cutsInfo={cutsState.cuts} />
                ))}
            {isLoading && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p>로딩 중...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrawingPage;
