import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
    WORD: 'word',
};

const QuizWordItem = ({ word, isUsed, index }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.WORD,
        item: { wordId: word.wordId, wordIndex: index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'pointer',
                visibility: isUsed ? 'hidden' : 'visible',
            }}
            className="flex justify-center items-center bg-[#8EBF5D] rounded-3xl h-[80px] text-white text-[32px]"
        >
            {word.word}
        </div>
    );
};

export default QuizWordItem;
