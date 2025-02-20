import React, { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import WordInfo from '../../components/word/WordInfo';
import CheckIcon from '../../assets/icon-check.png';
import { getLearningWords } from '../../api/word';
import { useNavigate } from 'react-router';
import SubscriberVideo from '../../components/SubscriberVideo';
import MyCamera from '../../components/MyCamera';
import AudioPlayer from '../../components/audio/AudioPlayer';

// 카메라 연결 필요
// 서버에서 모두 준비됐다는 이벤트 받으면 handleStep
const WordLearning = ({ partyId, sessionStageData, publisher, subscribers, nickname, sendReady }) => {
    const [words, setWords] = useState([]);
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const bgColors = ['bg-[#FFFFFF]', 'bg-[#FDFCDC]', 'bg-[#FED9B7]', 'bg-[#FFB5A7]'];
    const [checkedWords, setCheckedWords] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        console.log('WordLearning - sessionStageData:', sessionStageData);
    }, []);

    const handleCheck = wordId => {
        setCheckedWords(prev => {
            const newSet = new Set(prev);
            newSet.has(wordId) ? newSet.delete(wordId) : newSet.add(wordId);
            return newSet;
        });
    };

    const handleTimeOut = () => {
        handleStep();
    };

    const handleStep = () => {
        // TODO:
        // 사용자가 시간 조작해서 더 빨리 다음 단계를 요청할 경우를 대비해서,
        // 서버에 현재 단계가 맞는지 요청 보내는 api 추가 예정
        // navigate('/session/draw'); //다음 단계의 url로 수정 필요
    };

    const sendReadyRequest = async () => {
        try {
            sendReady();
            // 성공 로직
        } catch (error) {
            console.error('레디 요청 중 에러 발생:', error.message);
            // 사용자에게 보여줄 수 있는 에러 처리
        }
    };

    // 단어 로드
    useEffect(() => {
        getLearningWords(partyId).then(response => {
            setWords(response.data.words);
        });
    }, []);

    // 체크된 단어가 4개면 ready 신호 전송
    useEffect(() => {
        if (checkedWords.size === 4) {
            console.log('FE: 유저 단어학습 완료!');
            sendReadyRequest();
        }
    }, [checkedWords]);

    //Openvidu 세션 훅 사용
    //const { session, publisher, subscribers, joinSession, leaveSession, nickname } = useSession();

    // useEffect(() => {
    //     joinSession();
    //     return () => leaveSession();
    // }, []);

    return (
        <div className="bg-seashell h-screen">
            <AudioPlayer audioType="WORD" />
            <Navigation
                stage={'learning'}
                stageDuration={sessionStageData.sessionDuration}
                sessionStartTime={sessionStageData.sessionStartTime}
                serverTime={sessionStageData.serverTime}
                onTimeOut={handleTimeOut}
            />
            <div className="flex -mt-2 mx-8 justify-between h-[600px]">
                <div className="flex flex-col mt-4 gap-2.5 content-evenly mx-auto">
                    <MyCamera streamManager={publisher} nickname={nickname} small />
                    {subscribers.map((subscriber, index) => (
                        <SubscriberVideo key={index} streamManager={subscriber} small />
                    ))}
                </div>
                <WordInfo
                    word={words[currentWordIdx]}
                    isChecked={checkedWords.has(words[currentWordIdx]?.wordId)}
                    onCheck={() => handleCheck(words[currentWordIdx]?.wordId)}
                />
                <div className="flex flex-col w-[400px] gap-8 justify-between mt-4">
                    {words.map((word, index) => (
                        <div
                            key={index}
                            className={`p-8 text-center text-[46px] rounded-2xl cursor-pointer transition-all font-bold relative
                        ${bgColors[index % bgColors.length]} 
                        ${currentWordIdx === index ? 'border-solid border-4 border-burnt-sienna' : 'border-solid border-4 border-transparent'}`}
                            onClick={() => setCurrentWordIdx(index)}
                        >
                            {word.word}
                            {checkedWords.has(word.wordId) && (
                                <img src={CheckIcon} alt="Checked" className="absolute bottom-2 right-2 w-8 h-8" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WordLearning;
