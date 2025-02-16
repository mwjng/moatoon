import React, { useState, useEffect } from 'react';
import bbi_normal from '../../assets/bbi_normal.png';
import duckduck from '../../assets/duckduck.png';
import cado from '../../assets/cado.svg';
import { useNavigate } from 'react-router';
import AudioPlayer from '../../components/audio/AudioPlayer';

const FullPage = () => {
    const bounceStyle = {
        animation: 'bigBounce 1s infinite',
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 px-4">
            <AudioPlayer audioType="QUIZEND" />
            <style>
                {`
          @keyframes bigBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
        `}
            </style>

            {/* 캐릭터 컨테이너 */}
            <div className="flex justify-center items-end mb-8" style={{ marginTop: '-20px' }}>
                <div className="w-24 h-24 -mr-10">
                    <img
                        src={bbi_normal}
                        alt="character1"
                        className="w-full h-full object-contain"
                        style={{ ...bounceStyle }}
                    />
                </div>
                <div className="w-40 h-40 relative z-10">
                    <img
                        src={duckduck}
                        alt="character2"
                        className="w-full h-full object-contain"
                        style={{ ...bounceStyle, animationDelay: '0.2s' }}
                    />
                </div>
                <div className="w-24 h-24 -ml-11">
                    <img
                        src={cado}
                        alt="character3"
                        className="w-full h-full object-contain"
                        style={{ ...bounceStyle, animationDelay: '0.4s' }}
                    />
                </div>
            </div>
            {/* 메시지 */}
            <div className="text-center mb-8">
                <p className="text-xl font-bold text-gray-800 mb-2">지원하지 않는 화면 크기입니다.</p>
            </div>
        </div>
    );
};

export default FullPage;
