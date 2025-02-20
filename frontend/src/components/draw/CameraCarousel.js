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
            <button onClick={prevCamera} className="absolute left-0 bg-gray-300 p-2 rounded-full z-[3]">
                <IoIosArrowBack className="h-6 w-6" />
            </button>
            {isMyCamera ? (
                <MyCamera streamManager={publisher} nickname={nickname} />
            ) : (
                subscribers.length > 0 && <SubscriberVideo streamManager={subscribers[currentIndex - 1]} />
            )}
            <button onClick={nextCamera} className="absolute right-0 bg-gray-300 p-2 rounded-full z-[3]">
                <IoIosArrowForward className="h-6 w-6" />
            </button>
        </div>
    );
}

export default CameraCarousel;
