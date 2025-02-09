import React from 'react';
import postitImage from '../../assets/word-postit.png';

const WordInfo = ({ word, isChecked, onCheck }) => {
    return (
        <div className="flex flex-col mx-4 w-[800px] h-[700px] rounded-2xl shadow-lg text-center py-12 px-16 justify-between bg-white relative">
            <img src={postitImage} alt="" className="absolute top-[-70px] left-1/2 -translate-x-1/2 w-[400px]" />
            <div>
                <h1 className="text-[60px] font-bold">{word.word}</h1>
                <div className="text-[32px] mt-8 text-left">
                    {word.meaning.split('\\n').map((line, index) => (
                        <p key={index} className="my-4">
                            {line}
                            <br />
                        </p>
                    ))}
                </div>
                <ul className="mt-20 text-left space-y-8 list-disc">
                    {word.examples.map((example, index) => (
                        <li key={index} className="text-[28px]">
                            {example.split(/(\*.*?\*)/).map((part, index) =>
                                part.startsWith('*') && part.endsWith('*') ? (
                                    <strong key={index} className="font-bold text-[28px]">
                                        {part.slice(1, -1)}
                                    </strong>
                                ) : (
                                    part
                                ),
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="text-center">
                <button
                    onClick={onCheck}
                    className={`p-4 text-lg font-bold rounded-md transition-all !text-[32px]
                        ${isChecked ? 'bg-green-500 text-white' : 'bg-light-yellow'}`}
                >
                    {isChecked ? '완료!' : '이해했어요!'}
                </button>
            </div>
        </div>
    );
};

export default WordInfo;
