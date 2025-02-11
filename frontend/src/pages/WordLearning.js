import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import WordInfo from '../components/word/WordInfo';
import CheckIcon from '../assets/icon-check.png';
import { getLearningWords } from '../api/word';

const WordLearning = ({ partyId }) => {
    const [words, setWords] = useState([
        {
            wordId: 1,
            word: 'word',
            meaning: 'meaning',
            examples: ['example1', 'example2'],
        },
        {
            wordId: 1,
            word: 'word',
            meaning: 'meaning',
            examples: ['example1', 'example2'],
        },
        {
            wordId: 1,
            word: 'word',
            meaning: 'meaning',
            examples: ['example1', 'example2'],
        },
        {
            wordId: 1,
            word: 'word',
            meaning: 'meaning',
            examples: ['example1', 'example2'],
        },
    ]);
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const bgColors = ['bg-[#FFFFFF]', 'bg-[#FDFCDC]', 'bg-[#FED9B7]', 'bg-[#FFB5A7]'];
    const [checkedWords, setCheckedWords] = useState(new Set());

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
