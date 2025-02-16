import React from 'react';
import postitImage from '../../assets/word-postit.png';

const WordInfo = ({ word, isChecked, onCheck, index }) => {
    const bgColors = ['#FFFFFF', '#FDFCDC', '#FED9B7', '#FFB5A7'];

    return (
        <div
            className={`p-4 rounded-[30px] shadow-lg flex flex-col items-center justify-between w-[700px]
                border-[10px] border-solid bg-white gap-4 relative`}
            style={{ borderColor: bgColors[index] }}
        >
            <img
                src={postitImage}
                alt=""
                className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[300px] h-[60px]"
            />
            <div className="flex justify-between w-full">
                <div className="flex w-auto min-w-[170px] max-w-[200px] justify-center items-center text-[32px] font-bold [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
                    {word.word}
                </div>
                <div className="flex flex-col p-4 ml-4 mt-4 flex-1 bg-[#F7F5F5] w-full min-h-[150px] max-h-[200px] overflow-auto rounded-[20px]">
                    <p className="text-[28px]">뜻</p>
                    <ol className="list-decimal list-inside rounded-[10px] text-[24px] leading-8">
                        {word.meaning.split('\\n').map((line, index) => (
                            <li key={index} className="my-2">
                                {line}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            <div className="flex flex-col p-4 ml-4 mt-4 flex-1 bg-[#F7F5F5] w-full min-h-[150px] max-h-[150px] overflow-auto rounded-[20px]">
                <p className="text-[28px] inline-block">예문</p>
                <ol className="list-decimal list-inside rounded-[10px] w-full text-[24px] leading-8">
                    {word.examples.map((example, index) => (
                        <li key={index} className="my-2">
                            {example.split(/(\*.*?\*)/).map((part, index) =>
                                part.startsWith('*') && part.endsWith('*') ? (
                                    <strong key={index} className="font-bold">
                                        {part.slice(1, -1)}
                                    </strong>
                                ) : (
                                    part
                                ),
                            )}
                        </li>
                    ))}
                </ol>
            </div>

            <div className="text-center">
                <button
                    onClick={onCheck}
                    className={`p-4 text-lg font-bold rounded-md transition-all !text-[32px] w-[300px]
                ${isChecked ? 'bg-green-500 text-white' : 'bg-light-yellow'}`}
                    disabled={isChecked}
                >
                    {isChecked ? '완료!' : '이해했어요!'}
                </button>
            </div>
        </div>
    );
};

export default WordInfo;
