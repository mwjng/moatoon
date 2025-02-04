import React, { useState } from "react";
import OpenAI from "openai";
import BookDetail from "./BookDetail";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const BookStoryGenerator = ({ story, onClose }) => {
    const [currentStory, setCurrentStory] = useState(story);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showBookDetail, setShowBookDetail] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const handleRegenerateStory = async () => {
        setIsGenerating(true);
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "같은 키워드로 새로운 동화를 만들어줘." }],
        });
        setCurrentStory(response.choices[0]?.message?.content || "재생성 실패");
        setIsGenerating(false);
    };

    const handleGenerateBookCover = async () => {
        setIsGeneratingImage(true);
        
        const coverPrompt = `이 이야기를 바탕으로 표지를 만들어줘: ${currentStory.split("\n").slice(0, 5).join(" ")}`;
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: coverPrompt,
            n: 1,
            size: "1024x1024",
        });

        setCoverImage(response.data[0]?.url || "이미지 생성 실패");
        setShowBookDetail(true);
        setIsGeneratingImage(false);
    };

    return showBookDetail ? (
        <BookDetail coverImage={coverImage} storySummary={currentStory.split("\n").slice(0, 5).join(" ")} />
    ) : (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 relative">
                <h2 className="text-xl font-bold mb-4 text-center">📖 생성된 이야기</h2>
                <p className="mb-6">{currentStory}</p>

                {/* 버튼 영역 */}
                <div className="flex justify-between">
                    <button
                        onClick={handleRegenerateStory}
                        disabled={isGenerating || isGeneratingImage}
                        className={`px-4 py-2 rounded-lg font-bold ${
                            isGenerating ? "bg-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        {isGenerating ? "재생성 중..." : "재생성"}
                    </button>
                    <button
                        onClick={handleGenerateBookCover}
                        disabled={isGenerating || isGeneratingImage}
                        className={`px-4 py-2 rounded-lg font-bold ${
                            isGeneratingImage ? "bg-gray-400" : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                    >
                        {isGeneratingImage ? "그림책 생성 중..." : "결정하기"}
                    </button>
                </div>

                {/* 진행 중일 때 배경 블러 처리 및 "진행 중" 표시 */}
                {isGeneratingImage && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                        <p className="text-white text-lg font-bold">📖 그림책 생성 중...</p>
                    </div>
                )}

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-500 text-white rounded-full"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default BookStoryGenerator;