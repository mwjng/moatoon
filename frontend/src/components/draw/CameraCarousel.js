import React, { useState } from 'react';
import MyCamera from '../MyCamera';
import SubscriberVideo from '../SubscriberVideo';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

function CameraCarousel({ publisher, subscribers, nickname }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevCamera = () => {
        setCurrentIndex(prev => (prev === 0 ? subscribers.length : prev - 1));
    };

    const nextCamera = () => {
        setCurrentIndex(prev => (prev === subscribers.length ? 0 : prev + 1));
    };

    const isMyCamera = currentIndex == 0;

    return (
        <div className="relative flex items-center justify-center">
            {/* 왼쪽 화살표 버튼 */}
            <button onClick={prevCamera} className="absolute left-0 bg-gray-300 p-2 rounded-full z-[3]">
                <IoIosArrowBack className="h-6 w-6" />
            </button>
            ){/* 현재 선택된 카메라 화면 */}
            {isMyCamera ? (
                <MyCamera streamManager={publisher} nickname={nickname} />
            ) : (
                <SubscriberVideo streamManager={subscribers[currentIndex - 1]} />
            )}
            {/* 오른쪽 화살표 버튼 */}
            <button onClick={nextCamera} className="absolute right-0 bg-gray-300 p-2 rounded-full z-[3]">
                <IoIosArrowForward className="h-6 w-6" />
            </button>
        </div>
    );
}

export default CameraCarousel;
