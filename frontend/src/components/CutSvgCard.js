import React from 'react';
import emptyCut from '../assets/empty-cut.svg';
import StoryLine from './draw/StoryLine';

const CutCard = ({ item }) => {
    const imageUrl = item.imageUrl || emptyCut;
    return (
        <div className="relative w-full overflow-hidden bg-white">
            <img src={imageUrl} className="object-cover w-full h-full" alt="cut" />
            <StoryLine content={item.content} textSize="text-xs" leading="leading-tight" p="p-1.5" />
        </div>
    );
};

export default CutCard;
