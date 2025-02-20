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
            <div className={`absolute ${isMyCamera ? '' : 'invisible'}`}>
                <MyCamera streamManager={publisher} nickname={nickname} />
            </div>

            {subscribers.length > 0 &&
                subscribers.map((subscriber, index) => (
                    <div key={subscriber.id} className={`absolute ${index === currentIndex - 1 ? '' : 'invisible'}`}>
                        <SubscriberVideo streamManager={subscriber} />
                    </div>
                ))}
            <button onClick={nextCamera} className="absolute right-0 bg-gray-300 p-2 rounded-full z-[3]">
                <IoIosArrowForward className="h-6 w-6" />
            </button>
        </div>
    );
}

export default CameraCarousel;
