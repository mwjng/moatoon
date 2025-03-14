import React from 'react';
import { useDrop } from 'react-dnd';
import quizCircle from '../../assets/quiz-circle.png';
import quizStar from '../../assets/quiz-star.png';

const ItemTypes = {
    WORD: 'word',
};

const QuizItem = ({ onCorrect, quiz, index, isCorrect, isEnd, onFail }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.WORD,
        drop: item => onDrop(item),
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    });

    const onDrop = item => {
        if (isCorrect) return;

        if (quiz.wordId === item.wordId) {
            onCorrect(index, item.wordIndex);
        } else {
            onFail(quiz.wordId, quiz.word);
        }
    };

    return (
        <div
            ref={drop}
            style={{
                backgroundColor: isOver && !isCorrect ? 'lightgreen' : '#D9D9D9',
            }}
            className="flex gap-2 text-[28px] bg-opacity-40 rounded-full p-4 w-full relative"
        >
            <img
                src={isCorrect ? quizCircle : quizStar}
                alt=""
                className="absolute top-[-30px] left-[25px] transform -translate-x-1/2 h-[120px] object-fill"
                style={{ display: isCorrect || isEnd ? 'block' : 'none' }}
            />
            {isCorrect || isEnd ? (
                <div className="relative">{`${index + 1}. ${quiz.front} ${quiz.answer} ${quiz.back}`}</div>
            ) : (
                <div className="relative">{`${index + 1}. ${quiz.front} ____ ${quiz.back}`}</div>
            )}
            {/* <div className="relative">{`${index + 1}. ${quiz.front}`}</div>
            <span>{quiz.front}</span>
            {isCorrect || isEnd ? (
                <span className="px-4 bg-[#EDFEC3] rounded-full">{quiz.answer}</span>
            ) : (
                <span className="w-[80px] bg-white rounded-full"></span>
            )}
            <span>{quiz.back}</span> */}
        </div>
    );
};

export default QuizItem;
