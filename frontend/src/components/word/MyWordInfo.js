import React, { useState } from 'react';

const MyWordInfo = ({ word }) => {
    const [isFront, setIsFront] = useState(true);
    const failColor = ['#000000', '#8AD8FF', '#FFD105', '#FF90E1', '#8B8DFD', '#FF4D4D'];

    const handleClick = () => {
        setIsFront(!isFront);
    };

    return (
        <>
            {isFront ? (
                <div
                    className="p-4 mt-2 rounded-[30px] shadow-lg flex items-center justify-center w-[500px] h-[250px]
                    border-[10px] border-solid border-white"
                    style={{ backgroundColor: failColor[Math.min(word.failCount, 5)] }}
                    onClick={handleClick}
                >
                    <p className="text-lg font-semibold text-[48px] rounded-2xl p-4 bg-white bg-opacity-80">
                        {word.word}
                    </p>
                </div>
            ) : (
                <div
                    className="px-4 py-4 mt-2 rounded-[30px] shadow-lg flex flex-col items-center justify-center w-[500px] h-[250px]
                    border-[10px] border-solid border-seashell bg-white gap-4"
                    style={{ borderColor: failColor[Math.min(word.failCount, 5)] }}
                    onClick={handleClick}
                >
                    <div className="flex justify-between w-full gap-4 h-2/3">
                        <div className="p-4 min-w-[100px] flex justify-center items-center text-[32px] font-bold [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
                            {word.word}
                        </div>
                        <ol className="bg-[#F7F5F5] list-decimal pl-8 pr-4 rounded-[10px] w-full text-[16px]">
                            {word.meaning.split('\\n').map((line, index) => (
                                <li key={index} className="my-2">
                                    {line}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <ol className="bg-[#F7F5F5] list-decimal px-8 py-4 rounded-[10px] w-full text-[16px] h-2/3">
                        {word.example.map((example, index) => (
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
            )}
        </>
    );
};

export default MyWordInfo;
