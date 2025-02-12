import React from 'react';

const CutCard = ({ item }) => {
    return (
        <div className="relative w-full overflow-hidden bg-white">
            <img src={item.imageUrl} className="object-cover w-full h-full" alt="cut" />
            <div className="absolute w-full py-2.5 bottom-0 inset-x-0 text-black text-xs text-center leading-4">
                <p
                    className="text-xs text-center text-gray-700"
                    dangerouslySetInnerHTML={{ __html: item.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                ></p>
            </div>
        </div>
    );
};

export default CutCard;
