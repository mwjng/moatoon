import React from 'react';
import postitImage from '../../assets/word-postit.png';

const WordInfo = ({ word }) => {
    return (
        <div className="flex flex-col mx-4 w-[800px] rounded-2xl shadow-lg text-center py-12 px-16 justify-between bg-white relative">
            <img src={postitImage} alt="" className="absolute top-[-70px] left-1/2 -translate-x-1/2 w-[400px]" />
            <div>
                <h1 class="text-2xl font-bold">{word.word}</h1>
                <p class="text-lg mt-8 text-left">
                    {word.meaning.split('\\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
                <ul className="mt-16 text-left space-y-8 list-disc">
                    {word.examples.map((example, index) => (
                        <li key={index}>
                            {example.split(/(\*.*?\*)/).map((part, partIndex) =>
                                part.startsWith('*') && part.endsWith('*') ? (
                                    <strong key={partIndex} className="font-bold">
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

            <div class="mt-4 text-center">
                <button class="bg-light-yellow px-5 py-2 text-lg font-bold rounded-md">이해했어요!</button>
            </div>
        </div>
    );
};

export default WordInfo;
