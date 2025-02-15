import React from 'react';
import emptyCut from '../assets/empty-cut.svg';

const CutCard = ({ item }) => {
    const imageUrl = item.imageUrl || emptyCut;
    return (
        <div className="relative w-full overflow-hidden bg-white">
            <img src={imageUrl} className="object-cover w-full h-full" alt="cut" />
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
