import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import WordInfo from '../components/word/WordInfo';
import CheckIcon from '../assets/icon-check.png';
import { getLearningWords } from '../api/word';

const WordLearning = () => {
    const [words, setWords] = useState([
        {
            wordId: 5,
            word: '글씨',
            meaning: '쓴 글자의 모양.',
            examples: ['*글씨*를 또박또박 쓰세요.', '내 이름을 *글씨*로 써 보세요.'],
        },
        {
            wordId: 1,
            word: '그림',
            meaning:
                '선이나 색채를 써서 사물의 형상이나 이미지를 평면 위에 나타낸 것.\\n아름다운 경치를 비유적으로 이르는 말.',
            examples: ['나는 색연필로 *그림*을 그렸다.', '벽에 예쁜 *그림*이 걸려 있어.'],
        },
        {
            wordId: 3,
            word: '그만',
            meaning: '그 정도까지.\\n그대로 곧.\\n자신도 모르는 사이에.',
            examples: ['이제 *그만* 싸우자!', '장난은 *그만*하세요.'],
        },
        {
            wordId: 7,
            word: '글자',
            meaning: '말을 적는 일정한 체계의 부호.',
            examples: ['한글은 소중한 *글자*예요.', '*글자*를 바르게 배워야 해.'],
        },
    ]);
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const bgColors = ['bg-[#FFFFFF]', 'bg-[#FDFCDC]', 'bg-[#FED9B7]', 'bg-[#FFB5A7]'];
    const [checkedWords, setCheckedWords] = useState(new Set());
    const [partyId, setPartyId] = useState(1); //더미 값

    const handleCheck = wordId => {
        setCheckedWords(prev => {
            const newSet = new Set(prev);
            newSet.has(wordId) ? newSet.delete(wordId) : newSet.add(wordId);
            return newSet;
        });
    };

    useEffect(() => {
        getLearningWords(partyId).then(response => {
            setWords(response.data.words);
        });
    }, []);

    useEffect(() => {
        if (checkedWords.size === 4) {
            // 모든 단어 학습 완료
        }
    }, [checkedWords]);

    return (
        <div className="bg-seashell h-screen">
            <Navigation stage={'learning'} />
            <div className="flex m-8 justify-between h-[600px]">
                <div className="flex w-[400px] justify-center bg-white h-full">Camera</div>
                <WordInfo
                    word={words[currentWordIdx]}
                    isChecked={checkedWords.has(words[currentWordIdx].wordId)}
                    onCheck={() => handleCheck(words[currentWordIdx].wordId)}
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
