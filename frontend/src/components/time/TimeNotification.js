import React, { useState, useEffect } from 'react';
import bbi from '../../assets/bbi_normal.png';

// 말풍선 물결 효과를 위한 스타일
const bubbleWaveKeyframes = `
  @keyframes bubbleWave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

const TimeNotification = ({ message }) => {
    const [visible, setVisible] = useState(true);
    
    useEffect(() => {
        // 알림을 10초 동안 보여준 후 사라지게 함
        const timer = setTimeout(() => {
            setVisible(false);
        }, 10000);
        
        return () => {
            clearTimeout(timer);
        };
    }, []);
    
    if (!visible) return null;
    
    return (
        <>
            {/* 애니메이션 키프레임 스타일 */}
            <style>
                {bubbleWaveKeyframes}
            </style>
            
            <div className="fixed right-12 bottom-12 flex flex-col items-end z-50">
                {/* 말풍선 - 부드러운 움직임 효과 추가 */}
                <div className="relative mb-2">
                    <div 
                        className="bg-yellow-200 rounded-2xl p-5 shadow-xl relative"
                        style={{
                            minWidth: '180px',
                            animation: 'bubbleWave 2s ease-in-out infinite'
                        }}
                    >
                        <p className="text-2xl font-bold text-center text-black">{message}</p>
                        {/* 말풍선 꼬리 */}
                        <div 
                            className="absolute w-6 h-6 bg-yellow-200 transform rotate-45"
                            style={{ bottom: '-12px', left: '50%', marginLeft: '-12px' }}
                        ></div>
                    </div>
                </div>
                
                {/* 캐릭터 이미지 - 애니메이션 없음, 크기만 유지 */}
                <div className="w-36 h-36">
                    <img 
                        src={bbi} 
                        alt="알림 캐릭터" 
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </>
    );
};

export default TimeNotification;