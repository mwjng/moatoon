import React, { useState } from 'react';
import MyCamera from '../MyCamera';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

function CameraCarousel({ publishers }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevCamera = () => {
        setCurrentIndex(prev => (prev === 0 ? publishers.length - 1 : prev - 1));
    };

    const nextCamera = () => {
        setCurrentIndex(prev => (prev === publishers.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative flex items-center justify-center">
            <button onClick={prevCamera} className="absolute left-0 bg-gray-300 p-2 rounded-full">
                <IoIosArrowBack className="h-6 w-6" />
            </button>

            <MyCamera streamManager={publishers[currentIndex]} nickname={`참여자 ${currentIndex + 1}`} small />

            <button onClick={nextCamera} className="absolute right-0 bg-gray-300 p-2 rounded-full">
                <IoIosArrowForward className="h-6 w-6" />
            </button>
        </div>
    );
}

export default CameraCarousel;
