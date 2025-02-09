import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import QuizWordItem from '../components/quiz/QuizWordItem';
import quizBook from '../assets/quiz-book.png';
import quizTitle from '../assets/quiz-title.png';
import QuizItem from '../components/quiz/QuizItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const QuizPage = () => {
    const [quizs, setQuizs] = useState([
        {
            front: '옷 소매의 ',
            back: '가 특이하다.',
            word: '형태',
            wordId: 1,
        },
        {
            front: '옷 소매의 ',
            back: '가 특이하다.',
            word: '형태',
            wordId: 2,
        },
        {
            front: '옷 소매의 ',
            back: '가 특이하다.',
            word: '형태',
            wordId: 3,
        },
        {
            front: '옷 소매의 ',
            back: '가 특이하다.',
            word: '형태',
            wordId: 4,
        },
    ]);
    const [words, setWords] = useState([
        {
            wordId: 1,
            word: '형태',
        },
        {
            wordId: 2,
            word: '형태',
        },
        {
            wordId: 3,
            word: '형태',
        },
        {
            wordId: 4,
            word: '형태',
        },
        {
            wordId: 5,
            word: '형태',
        },
        {
            wordId: 6,
            word: '형태',
        },
        {
            wordId: 7,
            word: '형태',
        },
        {
            wordId: 8,
            word: '형태',
        },
    ]);
    const [correctList, setCorrectList] = useState([false, false, false, false]);
    const [useList, setUseList] = useState([false, false, false, false, false, false, false, false]);
    const [correctCount, setCorrectCount] = useState(0);

    const handleCorrect = (quizIndex, wordIndex) => {
        setCorrectCount(correctCount + 1);
        setCorrectList(prevList => {
            const newCorrectList = [...prevList];
            newCorrectList[quizIndex] = true;
            return newCorrectList;
        });
        setUseList(prevList => {
            const newUseList = [...prevList];
            newUseList[wordIndex] = true;
            return newUseList;
        });
    };

    useEffect(() => {
        if (correctCount === 4) {
        }
    }, [correctCount]);

    return (
        <div className="bg-[#ACDB33] bg-opacity-30 h-screen">
            <Navigation stage={'quiz'} />
            <DndProvider backend={HTML5Backend}>
                <div className="flex items-center justify-center px-20 gap-20">
                    <div
                        className="flex h-[850px] w-[1400px] bg-no-repeat bg-center bg-contain relative justify-center items-center"
                        style={{ backgroundImage: `url(${quizBook})` }}
                    >
                        <img src={quizTitle} alt="" className="absolute top-20 left-40" />
                        <div className="flex flex-col gap-12 w-full px-40">
                            {quizs.map((quiz, index) => (
                                <QuizItem
                                    key={index}
                                    index={index}
                                    quiz={quiz}
                                    onCorrect={handleCorrect}
                                    isCorrect={correctList[index]}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-[500px] h-[600px] bg-white bg-opacity-70 rounded-3xl px-4 py-8 justify-center items-center content-between">
                        {words.map((word, index) => (
                            <QuizWordItem key={index} word={word} isUsed={useList[index]} index={index} />
                        ))}
                    </div>
                </div>
            </DndProvider>
        </div>
    );
};

export default QuizPage;
