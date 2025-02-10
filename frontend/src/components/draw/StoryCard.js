import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Tag from '../../assets/tag.svg';

const texts = ['오늘의 스토리', '두 번째 이야기', '세 번째 이야기', '네 번째 이야기'];

const StoryCard = () => {
    const [index, setIndex] = useState(0);

    const handlePrev = () => {
        setIndex(prev => (prev === 0 ? texts.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex(prev => (prev === texts.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-80 h-96 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img src={Tag} alt="Tag" className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-64" />
            <h2 className="text-xl font-bold mt-10">{texts[index]}</h2>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <button onClick={handlePrev} className="p-2 bg-white rounded-full ">
                    <FaChevronLeft size={20} />
                </button>
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button onClick={handleNext} className="p-2 bg-white rounded-full">
                    <FaChevronRight size={20} />
                </button>
            </div>
            <p className="absolute bottom-4 text-sm">
                {index + 1}/{texts.length}
            </p>
        </div>
    );
};

export default StoryCard;
