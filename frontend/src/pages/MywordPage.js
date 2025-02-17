import React, { use, useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import MyWordInfo from '../components/word/MyWordInfo';
import charChick from '../assets/char-chick.png';
import charCado from '../assets/char-cado.png';
import iconWord from '../assets/icon-word.png';
import bracketLeft from '../assets/bracket-left.png';
import bracketRight from '../assets/bracket-right.png';
import { getMyWords, removeMyWord } from '../api/word';

const MyWordPage = () => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [words, setWords] = useState([]);
    const failColor = ['#000000', '#8AD8FF', '#FFD105', '#FF90E1', '#8B8DFD', '#FF4D4D'];
    const [showHint, setShowHint] = useState(false);

    const handleHint = () => {
        setShowHint(!showHint);
    };

    const updateWords = () => {
        if (page < 1) {
            setPage(1);
        } else if (page > totalPage) {
            setPage(totalPage);
        }
        getMyWordWithPage();
    };

    const handlePrev = async () => {
        setPage(page - 1);
        updateWords();
    };

    const handleNext = () => {
        setPage(page + 1);
        updateWords();
    };

    const handleRemoveMyWord = wordId => {
        removeWord(wordId);
    };

    const removeWord = wordId => {
        removeMyWord(wordId)
            .then(getMyWordWithPage)
            .catch(error => {
                console.error(error);
            });
    };

    const getMyWordWithPage = () => {
        getMyWords(page, keyword)
            .then(response => {
                setTotalPage(response.data.totalPage);
                setWords(response.data.myWordWithExamples);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        getMyWordWithPage();
    }, []);

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
                {words.length === 0 ? (
                    <div className="flex z-0 items-center bg-white p-8 rounded-[20px] gap-8">
                        <img src={charCado} alt="" className="h-[100px]" />
                        <span className="text-[48px]">복습할 단어가 없어요!</span>
                        <img src={charChick} alt="" className="h-[100px]" />
                    </div>
                ) : (
                    <div className="flex z-0 items-center">
                        <img src={bracketLeft} alt="" className="h-[120px] p-4 cursor-pointer" onClick={handlePrev} />
                        <div className="relative z-10 p-4 gap-4 flex ">
                            {words.map((word, index) => (
                                <MyWordInfo word={word} key={index} removeMyWord={handleRemoveMyWord} />
                            ))}
                        </div>
                        <img src={bracketRight} alt="" className="h-[120px] p-4 cursor-pointer" onClick={handleNext} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWordPage;
