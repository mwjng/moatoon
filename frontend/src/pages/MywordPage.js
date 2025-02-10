import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import MyWordInfo from '../components/word/MyWordInfo';
import charChick from '../assets/char-chick.png';
import charCado from '../assets/char-cado.png';
import iconWord from '../assets/icon-word.png';
import bracketLeft from '../assets/bracket-left.png';
import bracketRight from '../assets/bracket-right.png';

const MyWordPage = () => {
    const [page, setPage] = useState(1);
    const [words, setWords] = useState([
        {
            wordListId: 1,
            word: '형태',
            meaning: '사물의 생김새나 모양',
            failCount: 1,
            example: ['옷 소매의 *형태*가 특이하다.', '우리나라 가족의 *형태*는 대부분 핵가족 형태이다.'],
        },
        {
            wordListId: 2,
            word: '형태',
            meaning: '사물의 생김새나 모양\\n사물의 생김새나 모양\\n사물의 생김새나 모양',
            failCount: 2,
            example: ['옷 소매의 *형태*가 특이하다.', '우리나라 가족의 *형태*는 대부분 핵가족 형태이다.'],
        },
        {
            wordListId: 3,
            word: '형태',
            meaning: '사물의 생김새나 모양',
            failCount: 3,
            example: [
                '옷 소매의 *형태*가 특이하다.',
                '우리나라 가족의 *형태*는 대부분 핵가족 형태이다핵가족 형태이다.',
            ],
        },
        {
            wordListId: 4,
            word: '형태',
            meaning: '사물의 생김새나 모양',
            failCount: 4,
            example: ['옷 소매의 *형태*가 특이하다.', '우리나라 가족의 *형태*는 대부분 핵가족 형태이다.'],
        },
    ]);
    const failColor = ['#000000', '#8AD8FF', '#FFD105', '#FF90E1', '#8B8DFD', '#FF4D4D'];
    const [showHint, setShowHint] = useState(false);

    const handleHint = () => {
        setShowHint(!showHint);
    };

    const updateWords = () => {
        //api로 page에 맞는 단어 가져오기
        const newWords = [
            {
                wordListId: 3,
                word: '형태',
                meaning: '사물의 생김새나 모양',
                failCount: 3,
                example: [
                    '옷 소매의 *형태*가 특이하다.',
                    '우리나라 가족의 *형태*는 대부분 핵가족 형태이다핵가족 형태이다.',
                ],
            },
            {
                wordListId: 1,
                word: '형태',
                meaning: '사물의 생김새나 모양',
                failCount: 1,
                example: ['옷 소매의 *형태*가 특이하다.', '우리나라 가족의 *형태*는 대부분 핵가족 형태이다.'],
            },
            {
                wordListId: 2,
                word: '형태',
                meaning: '사물의 생김새나 모양\\n사물의 생김새나 모양\\n사물의 생김새나 모양',
                failCount: 2,
                example: ['옷 소매의 *형태*가 특이하다.', '우리나라 가족의 *형태*는 대부분 핵가족 형태이다.'],
            },

            {
                wordListId: 4,
                word: '형태',
                meaning: '사물의 생김새나 모양',
                failCount: 4,
                example: ['옷 소매의 *형태*가 특이하다.', '우리나라 가족의 *형태*는 대부분 핵가족 형태이다.'],
            },
        ];

        setWords(newWords);
    };

    const handlePrev = async () => {
        setPage(page - 1);
        updateWords();
    };

    const handleNext = () => {
        setPage(page + 1);
        updateWords();
    };

    const handleRemoveMyWord = myWordId => {
        // 단어 삭제시 실행될 부분
    };

    return (
        <div className="bg-[#FDFFE9] h-screen flex flex-col">
            <Navigation />
            <div className="relative h-full z-10 flex items-center justify-center">
                <div className="absolute z-20 top-0 right-0 m-4">
                    <div
                        className="flex h-[50px] items-center justify-center text-[#9F9595] cursor-pointer"
                        onClick={handleHint}
                    >
                        <img src={iconWord} alt="" className="w-[30px] h-[30px] object-contain" />
                        <span className="font-bold text-[16px]">틀린 횟수 설명</span>
                    </div>
                    <div
                        className="flex flex-col gap-2 p-2 rounded-[10px] bg-white"
                        style={{ visibility: showHint ? 'visible' : 'hidden' }}
                    >
                        <div
                            className="p-2 rounded-[10px] text-[14px] font-bold"
                            style={{ backgroundColor: failColor[1] }}
                        >
                            1회 틀린 단어
                        </div>
                        <div
                            className="p-2 rounded-[10px] text-[14px] font-bold"
                            style={{ backgroundColor: failColor[2] }}
                        >
                            2회 틀린 단어
                        </div>
                        <div
                            className="p-2 rounded-[10px] text-[14px] font-bold"
                            style={{ backgroundColor: failColor[3] }}
                        >
                            3회 틀린 단어
                        </div>
                        <div
                            className="p-2 rounded-[10px] text-[14px] font-bold"
                            style={{ backgroundColor: failColor[4] }}
                        >
                            4회 틀린 단어
                        </div>
                        <div
                            className="p-2 rounded-[10px] text-[14px] font-bold"
                            style={{ backgroundColor: failColor[5] }}
                        >
                            5회 이상 틀린 단어
                        </div>
                    </div>
                </div>
                <div className="bg-[#F3F8C0] w-full absolute h-1/2 bottom-0 z-0">
                    <img src={charCado} alt="" className="absolute left-0 top-[-250px] h-[250px]" />
                    <img src={charChick} alt="" className="absolute right-0 bottom-0 h-[250px]" />
                </div>
                <div className="flex z-0 gap-8 items-center">
                    <img src={bracketLeft} alt="" className="h-[120px] p-4 cursor-pointer" onClick={handlePrev} />
                    <div className="relative z-10 p-4 grid grid-cols-2 gap-4">
                        {words.map(word => (
                            <MyWordInfo word={word} key={word.wordListId} removeMyWord={handleRemoveMyWord} />
                        ))}
                    </div>
                    <img src={bracketRight} alt="" className="h-[120px] p-4 cursor-pointer" onClick={handleNext} />
                </div>
            </div>
        </div>
    );
};

export default MyWordPage;
