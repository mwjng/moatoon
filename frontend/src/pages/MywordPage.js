import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import MyWordInfo from '../components/word/MyWordInfo';
import charChick from '../assets/char-chick.png';
import charCado from '../assets/char-cado.png';

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

    return (
        <div className="bg-[#FDFFE9] h-screen flex flex-col">
            <Navigation />
            <div className="relative h-full z-10 flex items-center justify-center">
                <div className="bg-[#F3F8C0] w-full absolute h-1/2 bottom-0 z-0">
                    <img src={charCado} alt="" className="absolute left-0 top-[-250px] h-[250px]" />
                    <img src={charChick} alt="" className="absolute right-0 bottom-0 h-[250px]" />
                </div>
                <div className="relative z-10 p-4 grid grid-cols-2 gap-4">
                    {words.map(word => (
                        <MyWordInfo word={word} key={word.wordListId} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyWordPage;
