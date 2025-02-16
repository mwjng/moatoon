import React from 'react';
import postitImage from '../../assets/word-postit.png';

const WordInfo = ({ word, isChecked, onCheck }) => {
    const splitMeaning = word?.meaning.split('.');
    const filteredMeaning = splitMeaning?.filter(text => text.trim().length > 0);

    return (
        <div className="flex flex-col mx-4 mt-6 w-[850px] h-[565px] rounded-2xl shadow-lg bg-white/95 relative border-4 border-pink-200">
            {/* Post-it Image */}
            <img
                src={postitImage}
                alt=""
                className="absolute mb-[10px] ml-[10px] top-[-40px] left-1/2 -translate-x-1/2 w-[280px] h-[70px]"
            />

            {/* Title Section with enhanced emphasis */}
            <div className="pt-12 pb-6 px-12 flex justify-center">
                <div className="relative inline-block">
                    <h1 className="text-[42px] font-bold text-gray-800 relative z-10">
                        {word?.word}
                    </h1>
                    <div className="absolute -bottom-2 left-0 w-full h-4 bg-yellow-200/60 -rotate-1" />
                </div>
            </div>

            {/* Content Container with custom scrollbar hiding */}
            <div className="px-12 flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Meaning Section */}
                <div className="mb-8">
                    <h2 className="font-bold text-2xl text-gray-700 mb-4 flex items-center">
                        <div className="w-1.5 h-7 bg-purple-400 rounded-full mr-2"></div>
                        뜻
                    </h2>
                    <div className="space-y-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 shadow-inner">
                        {filteredMeaning?.map((line, index) => (
                            <p key={index} className="text-xl text-gray-600 leading-relaxed pl-2 border-l-2 border-purple-200">
                                {line.trim()}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Examples Section */}
                <div className="mb-16">
                    <h2 className="font-bold text-2xl text-gray-700 mb-4 flex items-center">
                        <div className="w-1.5 h-7 bg-blue-400 rounded-full mr-2"></div>
                        예문
                    </h2>
                    <div className="space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 shadow-inner">
                        {word?.examples.map((example, index) => (
                            <div key={index} className="flex items-start space-x-3 group">
                                <span className="text-blue-400 mt-1 text-lg">•</span>
                                <p className="text-xl text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                                    {example.split(/(\*.*?\*)/).map((part, idx) =>
                                        part.startsWith('*') && part.endsWith('*') ? (
                                            <span 
                                                key={idx} 
                                                className="font-bold text-gray-800 bg-yellow-100 rounded px-1.5 py-0.5"
                                            >
                                                {part.slice(1, -1)}
                                            </span>
                                        ) : (
                                            part
                                        )
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Button Section */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <button
                    onClick={onCheck}
                    className={`px-8 py-3 text-xl font-bold rounded-xl
                        ${isChecked 
                            ? 'bg-green-400 text-white' 
                            : 'bg-light-yellow hover:bg-yellow-200'
                        }`}
                    disabled={isChecked}
                >
                    {isChecked ? '완료!' : '이해했어요!'}
                </button>
            </div>
        </div>
    );
};

export default WordInfo;