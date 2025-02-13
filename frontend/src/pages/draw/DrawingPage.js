import React, { useState, useRef } from 'react';
import Overview from '../../components/draw/Overview';
import Drawing from '../../components/draw/Drawing';
import Navigation from '../../components/Navigation';
import { useNavigate } from 'react-router-dom';

const DrawingPage = () => {
    const navigate = useNavigate();
    const [isDrawing, setIsDrawing] = useState(true);
    const drawingRef = useRef(null);

    const toggleView = () => {
        setIsDrawing(prev => !prev);
    };

    const handleTimeOut = () => {
        if (drawingRef.current) {
            drawingRef.current.exportToSVGAndUpload(); // Drawing의 함수 호출
        }
        navigate('/session/draw-end');
    };

    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="w-full mb-5">
                <Navigation stage="drawing" onTimeOut={handleTimeOut} />
            </div>
            {isDrawing ? <Drawing ref={drawingRef} toggleView={toggleView} /> : <Overview toggleView={toggleView} />}
        </div>
    );
};

export default DrawingPage;
