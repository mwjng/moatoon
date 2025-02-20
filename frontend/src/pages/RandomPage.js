import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import random from '../assets/random.gif';
import randomStop from '../assets/random-stop.png';
import RandomResult from '../components/RandomResult';
import { useSelector } from 'react-redux';

export default function RandomPage({ sessionStageData }) {
    const [ready, setReady] = useState(false);

    const userId = useSelector(state => state.user.userInfo.id);
    const cutsState = useSelector(state => state.cuts.cuts);

    const cut = cutsState.find(cut => cut.memberId === userId)?.cutOrder;

    const handleTimeOut = () => {};

    useEffect(() => {
        const timer = setTimeout(() => {
            setReady(true);
        }, 2450);

        return () => clearTimeout(timer);
    }, []);

    // 페이지 로드 시 body에 overflow:hidden 추가하고 언마운트 시 제거
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="bg-[#FEFBEB] w-screen h-screen flex flex-col overflow-hidden absolute inset-0">
            <Navigation
                stage="picking"
                onTimeOut={handleTimeOut}
                stageDuration={sessionStageData.sessionDuration}
                sessionStartTime={sessionStageData.sessionStartTime}
                serverTime={sessionStageData.serverTime}
            />
            <div className="flex-1 flex justify-center items-center -mt-8 p-4">
                {ready ? (
                    <img src={randomStop} className="max-h-[80vh] w-auto object-contain" />
                ) : (
                    <img src={random} className="max-h-[80vh] w-auto object-contain" />
                )}
            </div>
            {ready && <RandomResult cut={cut} />}
        </div>
    );
}
