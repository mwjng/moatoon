import React, { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import quizBook from '../../assets/quiz-book.png';
import quizTitle from '../../assets/quiz-title.png';
import QuizWordItem from '../../components/quiz/QuizWordItem';
import QuizItem from '../../components/quiz/QuizItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getQuizs, addToMyWords } from '../../api/word';
import { useNavigate } from 'react-router';
import AudioPlayer from '../../components/audio/AudioPlayer'
import { sendReportMail } from '../../api/mail';

const QuizPage = ({onChangeStage}) => {
    const [quizs, setQuizs] = useState([]);
    const [words, setWords] = useState([]);
    const [correctList, setCorrectList] = useState([false, false, false, false]);
    const [failList, setFailList] = useState(new Set());
    const [useList, setUseList] = useState([false, false, false, false, false, false, false, false]);
    const [correctCount, setCorrectCount] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [partyId, setPartyId] = useState(1); //임의 값
    const [sessionStart] = useState(Date.now());  // 시작 시간을 상태로 관리
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
        // 마지막에 실행되는 함수
        const newFailList = new Set(failList);
        const failWordsForMail = []; // 틀린 단어들을 담을 배열 생성

        correctList.forEach((isCorrect, index) => {
            if (!isCorrect) {
                const wordId = quizs[index]?.wordId;
                const word = quizs[index]?.word;
                if (wordId) {
                    newFailList.add(wordId);
                    failWordsForMail.push(word);
                }
            }
        });

        setFailList(newFailList);
        const failWordIds = Array.from(newFailList);

        addToMyWords(failWordIds)
        .then(() => {
            return sendReportMail(failWordsForMail);
        })
        .then(() => {
            setTimeout(() => {
                onChangeStage();
            }, 3000);
        })
        .catch(error => {
            if (error.config?.url?.includes('/mywords')) {
                console.error('단어장 추가 중 에러 발생:', error);
            } else if (error.config?.url?.includes('/mail')) {
                console.error('메일 전송 중 에러 발생:', error);
            } else {
                console.error('알 수 없는 에러 발생:', error);
            }
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
            <AudioPlayer audioType="QUIZ" />
            <Navigation 
                stage={'quiz'} 
                stageDuration={60*1}
                sessionStartTime={sessionStart}
                serverTime={sessionStart}
                onTimeOut={handleTimeOut} 
            />
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