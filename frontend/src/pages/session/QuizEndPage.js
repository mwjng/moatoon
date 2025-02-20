import React, { useState, useEffect } from 'react';
import bbi_normal from '../../assets/bbi_normal.png';
import duckduck from '../../assets/duckduck.png';
import cado from '../../assets/kado.png';
import { useNavigate } from 'react-router';
import AudioPlayer from '../../components/audio/AudioPlayer';

const RoundText = () => (
    <svg viewBox="0 0 400 200" className="w-full max-w-2xl h-32 mb--2">
        <defs>
            <path id="round" d="M40,140 C160,40 240,40 360,140" fill="transparent" />
        </defs>
        <text
            className="fill-amber-400"
            style={{
                fontSize: '70px',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                fontFamily:
                    'system-ui, -apple -system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
        >
            <textPath href="#round" startOffset="50%" textAnchor="middle">
                퀴즈종료
            </textPath>
        </text>
    </svg>
);

const QuizEndPage = ({ leaveSession }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(7);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const handleLeaveSession = () => {
        leaveSession();
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShouldRedirect(true);
        }
    }, [countdown]);

    useEffect(() => {
        if (shouldRedirect) {
            handleLeaveSession();
        }
    }, [shouldRedirect]);

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

            {/* 제목 */}
            <div className="w-full flex justify-center -mb-4">
                <RoundText />
            </div>

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
                <p className="text-xl font-bold text-gray-800 mb-2">오늘의 퀴즈를 완료했어요!</p>
                <p className="text-gray-600">{countdown}초 후 학습이 종료됩니다.</p>
            </div>

            {/* 버튼 */}
            <button
                className="px-12 py-3 bg-yellow-400 text-white rounded-full font-bold shadow-lg hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105"
                onClick={() => setShouldRedirect(true)}
            >
                종료
            </button>
        </div>
    );
};

export default QuizEndPage;
