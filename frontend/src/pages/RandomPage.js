import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import random from '../assets/random.gif';
import randomStop from '../assets/random-stop.png';
import { useNavigate } from 'react-router';
import RandomResult from '../components/RandomResult';

export default function RandomPage() {
    const [ready, setReady] = useState(false);
    const cut = 1; // todo: 내 담당 컷 번호 작성하기

    const navigate = useNavigate();
    const handleTimeOut = () => {
        handleStep();
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setReady(true);
        }, 2450);

        return () => clearTimeout(timer);
    }, []);

    const handleStep = () => {
        navigate('/session/draw');
    };
    return (
        <div className="bg-[#FEFBEB] w-full h-screen">
            <Navigation stage="picking" onTimeOut={handleTimeOut} stageTime="0.11" />
            {ready ? (
                <img src={randomStop} style={{ margin: 'auto' }} />
            ) : (
                <img src={random} style={{ margin: 'auto' }} />
            )}
            {ready && <RandomResult cut={cut} />}
        </div>
    );
}
