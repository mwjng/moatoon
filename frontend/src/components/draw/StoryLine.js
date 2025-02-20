import React from 'react';

const StoryLine = ({ content, textSize, leading, padding }) => {
    return (
        <div className={`absolute p-1 bottom-0 w-full text-center ${padding} text-black ${textSize}`}>
            <p
                className={`text-gray-700 ${leading} bg-white bg-opacity-90 border border-black border-solid rounded-lg p-2`}
                dangerouslySetInnerHTML={{
                    __html: content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                }}
            />
        </div>
    );
};

export default StoryLine;
