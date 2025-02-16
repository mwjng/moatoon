import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import random from '../assets/random.gif';
import randomStop from '../assets/random-stop.png';
import RandomResult from '../components/RandomResult';
import { useSelector } from 'react-redux';

export default function RandomPage({ sessionStageData }) {
    const [ready, setReady] = useState(false);

    //const cut = 1; // todo: 내 담당 컷 번호 작성하기
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

    return (
        <div className="bg-[#FEFBEB] w-full h-screen">
            <Navigation
                stage="picking"
                onTimeOut={handleTimeOut}
                stageDuration={sessionStageData.sessionDuration}
                sessionStartTime={sessionStageData.sessionStartTime}
                serverTime={sessionStageData.serverTime}
            />
            {ready ? (
                <img src={randomStop} style={{ margin: 'auto' }} />
            ) : (
                <img src={random} style={{ margin: 'auto' }} />
            )}
            {ready && <RandomResult cut={cut} />}
        </div>
    );
}
