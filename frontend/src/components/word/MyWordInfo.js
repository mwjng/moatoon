import React, { useState } from 'react';
import cross from '../../assets/cross.svg';

const MyWordInfo = ({ word, removeMyWord }) => {
    const [isFront, setIsFront] = useState(true);
    const failColor = ['#000000', '#8AD8FF', '#FFD105', '#FF90E1', '#8B8DFD', '#FF4D4D'];

    const handleClick = () => {
        setIsFront(!isFront);
    };

    const handleRemove = event => {
        event.stopPropagation();
        removeMyWord(word.id);
    };

    return (
        <div className="group [perspective:1000px]">
            <div
                className={`relative h-full w-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d] ${
                    isFront ? '' : '[transform:rotateY(180deg)]'
                }`}
            >
                {/* front side */}
                <div
                    className="p-4 mt-2 rounded-[30px] shadow-lg flex items-center justify-center h-[400px] w-[500px]
                    border-[10px] border-solid border-white cursor-pointer absolute inset-0 [backface-visibility:hidden]"
                    style={{ backgroundColor: failColor[Math.min(word.failCount, 5)] }}
                    onClick={handleClick}
                >
                    <p className="font-semibold rounded-2xl p-4 bg-white bg-opacity-80 text-[48px]">{word.word}</p>
                </div>
                {/* back side */}
                <div
                    className="px-4 py-4 mt-2 rounded-[30px] shadow-lg flex flex-col items-center justify-center h-[400px] w-[500px]
                    border-[10px] border-solid border-seashell bg-white gap-4 cursor-pointer relative
                    inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]"
                    style={{ borderColor: failColor[Math.min(word.failCount, 5)] }}
                    onClick={handleClick}
                >
                    <img
                        src={cross}
                        alt=""
                        className="absolute w-[50px] h-[50px] top-0 right-0 p-[5px] bg-white bg-opacity-80 rounded-full"
                        onClick={handleRemove}
                    />
                    <div className="flex justify-between w-full gap-4 h-2/3">
                        <div className="p-4 min-w-[100px] flex justify-center items-center text-[32px] font-bold [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
                            {word.word}
                        </div>
                        <ol className="bg-[#F7F5F5] list-decimal pl-8 py-4 pr-4 rounded-[10px] w-full text-[16px] leading-6">
                            {word.meaning.split('\\n').map((line, index) => (
                                <li key={index} className="my-2">
                                    {line}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <ol className="bg-[#F7F5F5] list-decimal px-8 py-4 rounded-[10px] w-full text-[16px] h-2/3">
                        {word.examples.map((example, index) => (
                            <li key={index} className="my-2 leading-6">
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
            </div>
        </div>
    );
};

export default MyWordInfo;
