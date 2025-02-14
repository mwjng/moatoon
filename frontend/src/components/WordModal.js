import React from 'react';
import postitImage from '../assets/word-postit.png';

const WordModal = ({ word, onClose }) => {
    if (!word) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col mx-4 mt-4 w-[800px] h-[600px] rounded-2xl shadow-lg text-center py-12 px-16 justify-between bg-white relative">
                <img
                    src={postitImage}
                    alt=""
                    className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[80px]"
                />
                <div>
                    <h1 className="text-[40px] font-bold">{word.word}</h1>
                    <div className="mt-4 text-left">
                        <p className="font-bold text-[28px]">뜻</p>
                        {word.meaning.split('\\n').map((line, index) => (
                            <p key={index} className="my-4 text-[24px]">
                                {line}
                                <br />
                            </p>
                        ))}
                    </div>
                    <ul className="mt-12 text-left space-y-8 list-disc">
                        <p className="font-bold text-[28px]">예문</p>
                        {word.examples.map((example, index) => (
                            <li key={index} className="text-[24px]">
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
                    </ul>
                </div>

                {/* X 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default WordModal;
