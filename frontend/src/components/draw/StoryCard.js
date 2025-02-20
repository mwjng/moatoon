import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Tag from '../../assets/tag.svg';

const StoryCard = ({ story }) => {
    const [index, setIndex] = useState(0);
    
    const handlePrev = () => {
        setIndex(prev => (prev === 0 ? story.length - 1 : prev - 1));
    };
    
    const handleNext = () => {
        setIndex(prev => (prev === story.length - 1 ? 0 : prev + 1));
    };
    
    return (
        <div className="relative w-full aspect-[3/4] bg-[#fffef5] shadow-lg rounded-lg flex flex-col mt-4">
            {/* Tag positioned higher to avoid overlap */}
            <img src={Tag} alt="Tag" className="absolute top-[-25px] left-1/2 -translate-x-1/2 w-56 z-10" />
            
            {/* Increased top margin to accommodate tag */}
            <div className="mt-12 mb-2 text-center px-2">
                <h2 className="text-lg font-bold truncate">
                    컷 {story[index].cutId} : {story[index].nickname}
                </h2>
            </div>
            
            <div className="flex flex-row items-center justify-between px-2 flex-1">
                {/* Left navigation button */}
                <button 
                    onClick={handlePrev} 
                    className="p-1.5 bg-white rounded-full shadow-md z-20 hover:bg-gray-100 flex-shrink-0 mr-3"
                    aria-label="Previous story"
                >
                    <FaChevronLeft size={16} />
                </button>
                
                {/* Content wrapper with better padding and scrolling */}
                <div className="flex-1 overflow-y-auto max-h-64 my-2">
                    <p
                        className="text-md text-center text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: story[index].content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                        }}
                    />
                </div>
                
                {/* Right navigation button */}
                <button 
                    onClick={handleNext} 
                    className="p-1.5 bg-white rounded-full shadow-md z-20 hover:bg-gray-100 flex-shrink-0 ml-3"
                    aria-label="Next story"
                >
                    <FaChevronRight size={16} />
                </button>
            </div>
            
            {/* Page indicator with better positioning */}
            <p className="text-sm text-center pb-3 pt-1">
                {index + 1}/{story.length}
            </p>
        </div>
    );
};

export default StoryCard;