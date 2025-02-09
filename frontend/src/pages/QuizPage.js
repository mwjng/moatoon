import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import quizBook from '../assets/quiz-book.png';
import quizTitle from '../assets/quiz-title.png';

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

    return (
        <div className="bg-[#ACDB33] bg-opacity-30 h-screen">
            <Navigation stage={'quiz'} />
            <div className="flex items-center justify-center px-20 gap-20">
                <div
                    className="flex h-[850px] w-[1400px] bg-no-repeat bg-center bg-contain relative justify-center items-center"
                    style={{ backgroundImage: `url(${quizBook})` }}
                >
                    <img src={quizTitle} alt="" className="absolute top-20 left-40" />
                    <div className="flex flex-col gap-12 w-full px-40">
                        {quizs.map((quiz, index) => (
                            <div className="flex gap-4 text-[36px] bg-[#D9D9D9] bg-opacity-40 rounded-full p-4 bg-opacity-40">
                                <p>{index + 1}.</p>
                                <p>{quiz.front}</p>
                                <div className="w-[80px] bg-white rounded-full"></div>
                                <p>{quiz.back}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-[500px] h-[600px] bg-white bg-opacity-70 rounded-3xl px-4 py-8 justify-center items-center content-between">
                    {words.map((word, index) => (
                        <div className="flex justify-center items-center bg-[#8EBF5D] rounded-3xl h-[80px] text-white text-[24px]">
                            {word.word}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
