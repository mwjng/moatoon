import React from 'react';

const CutCard = ({ item }) => {
    const img1 = 'https://moabucket.s3.amazonaws.com/9ffe6925-b398-4746-af26-3b12f2b22d58-drawing.svg';
    return (
        <div className="relative w-full overflow-hidden bg-white">
            <img src={img1} className="object-cover w-full h-full" alt="cut" />
            <div className="absolute w-full py-2.5 bottom-0 inset-x-0 text-black text-xs text-center leading-4">
                <p
                    className="text-md text-center text-gray-700"
                    dangerouslySetInnerHTML={{ __html: item.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                ></p>
            </div>
        </div>
    );
};

export default CutCard;
