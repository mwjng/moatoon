import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import quizBook from '../assets/quiz-book.png';
import quizTitle from '../assets/quiz-title.png';
import QuizWordItem from '../components/quiz/QuizWordItem';
import QuizItem from '../components/quiz/QuizItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getQuizs, addToMyWords } from '../api/word';
import { useNavigate } from 'react-router';

const QuizPage = () => {
    const [quizs, setQuizs] = useState([
        {
            front: 'front',
            back: 'back',
            word: 'word',
            wordId: 1,
        },
        {
            front: 'front',
            back: 'back',
            word: 'word',
            wordId: 2,
        },
        {
            front: 'front',
            back: 'back',
            word: 'word',
            wordId: 3,
        },
        {
            front: 'front',
            back: 'back',
            word: 'word',
            wordId: 4,
        },
    ]);
    const [words, setWords] = useState([
        {
            wordId: 1,
            word: 'word',
        },
        {
            wordId: 2,
            word: 'word',
        },
        {
            wordId: 3,
            word: 'word',
        },
        {
            wordId: 4,
            word: 'word',
        },
        {
            wordId: 5,
            word: 'word',
        },
        {
            wordId: 6,
            word: 'word',
        },
        {
            wordId: 7,
            word: 'word',
        },
        {
            wordId: 8,
            word: 'word',
        },
    ]);
    const [correctList, setCorrectList] = useState([false, false, false, false]);
    const [failList, setFailList] = useState(new Set());
    const [useList, setUseList] = useState([false, false, false, false, false, false, false, false]);
    const [correctCount, setCorrectCount] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [partyId, setPartyId] = useState(1); //임의 값
    const stageTime = 5;
    const navigate = useNavigate();

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

    const handleFail = quizWordIndex => {
        setFailList(prevFailList => new Set(prevFailList).add(quizWordIndex));
    };

    const handleStep = async () => {
        const newFailList = new Set(failList);

        correctList.forEach((isCorrect, index) => {
            if (!isCorrect) {
                const wordId = quizs[index]?.wordId;
                if (wordId) {
                    newFailList.add(wordId);
                }
            }
        });

        setFailList(newFailList);
        await addToMyWords(Array.from(newFailList))
            .then(
                setTimeout(() => {
                    navigate('/'); // 다음 단계의 url로 변경 필요
                }, 5000),
            )
            .catch(error => {
                console.error('에러 발생:', error);
            });
    };

    const handleTimeOut = () => {
        setIsEnd(true);
    };

    useEffect(() => {
        if (correctCount === 4 || isEnd) {
            handleStep();
        }
    }, [correctCount, isEnd]);

    useEffect(() => {
        getQuizs(partyId).then(response => {
            setQuizs(response.data.sentences);
            setWords(response.data.quizWords);
        });
    }, []);

    return (
        <div className="bg-[#ACDB33] bg-opacity-30 h-screen flex flex-col">
            <Navigation stage={'quiz'} stageTime={stageTime} onTimeOut={handleTimeOut} />
            <div className="flex grow px-20 gap-20">
                <DndProvider backend={HTML5Backend}>
                    <div
                        className="flex grow bg-no-repeat bg-center bg-contain relative h-full p-12"
                        style={{ backgroundImage: `url(${quizBook})` }}
                    >
                        <img src={quizTitle} alt="" className="absolute top-10 left-0" />
                        <div className="flex flex-col gap-8 w-full justify-center">
                            {quizs.map((quiz, index) => (
                                <QuizItem
                                    key={index}
                                    index={index}
                                    quiz={quiz}
                                    onCorrect={handleCorrect}
                                    isCorrect={correctList[index]}
                                    isEnd={isEnd}
                                    onFail={handleFail}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-[500px] bg-white bg-opacity-70 rounded-3xl px-4 py-8 justify-center items-center content-between my-12">
                        {words.map((word, index) => (
                            <QuizWordItem key={index} word={word} isUsed={useList[index]} index={index} />
                        ))}
                    </div>
                </DndProvider>
            </div>
        </div>
    );
};

export default QuizPage;
