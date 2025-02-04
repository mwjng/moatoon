import React, { useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // ✅ 템플릿 리터럴 제거
  dangerouslyAllowBrowser: true, // ✅ React 환경에서 사용하기 위해 필요 (보안 주의)
});

const BookStoryGenerator = () => {
    const [story, setStory] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateStory = async () => {
        setIsGenerating(true);

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini", // ✅ 모델명 수정
                messages: [
                    {"role": "user", "content": "AI에 대한 하이쿠를 작성해줘."}
                ],
            });

            setStory(response.choices[0].message.content);
        } catch (error) {
            console.error("스토리 생성 오류:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold">📚 AI 스토리 생성기</h1>
            
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={generateStory}
                disabled={isGenerating}
            >
                {isGenerating ? "생성 중..." : "스토리 생성"}
            </button>

            {story && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100 w-3/4">
                    <p>{story}</p>
                </div>
            )}
        </div>
    );
};

export default BookStoryGenerator;
