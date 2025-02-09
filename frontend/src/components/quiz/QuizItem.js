import React from 'react';
import { useDrop } from 'react-dnd';

const ItemTypes = {
    WORD: 'word',
};

const QuizItem = ({ onCorrect, quiz, index, isCorrect }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.WORD,
        drop: item => onDrop(item),
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    });

    const onDrop = item => {
        if (quiz.wordId === item.wordId) {
            onCorrect(index, item.wordIndex);
        }
    };

    return (
        <div
            ref={drop}
            style={{
                backgroundColor: isOver && !isCorrect ? 'lightgreen' : '#D9D9D9',
            }}
            className="flex gap-4 text-[32px] bg-opacity-40 rounded-full p-4 bg-opacity-40 align-ceneter"
        >
            <p>{index + 1}.</p>
            <p>{quiz.front}</p>
            {isCorrect ? (
                <div className="px-4 bg-[#EDFEC3] rounded-full">{quiz.word}</div>
            ) : (
                <div className="w-[80px] bg-white rounded-full"></div>
            )}
            <p>{quiz.back}</p>
        </div>
    );
};

export default QuizItem;
