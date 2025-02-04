import React, { useState } from "react";
import { generateImage } from "../api/openai";

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState(""); // 사용자 입력
    const [imageUrl, setImageUrl] = useState(""); // 생성된 이미지 URL
    const [loading, setLoading] = useState(false); // 로딩 상태

    const handleGenerate = async () => {
        if (!prompt) return alert("이미지 설명을 입력하세요!");

        setLoading(true); // 로딩 시작
        const url = await generateImage(prompt);
        setLoading(false); // 로딩 종료

        if (url) {
            setImageUrl(url);
        } else {
            alert("이미지를 생성하는 데 실패했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center p-10">
            <h1 className="text-2xl font-bold mb-5">🎨 AI 이미지 생성기</h1>
            <input
                type="text"
                placeholder="생성할 이미지 설명을 입력하세요..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="border p-2 w-96 mb-4"
            />
            <button
                onClick={handleGenerate}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "생성 중..." : "이미지 생성"}
            </button>
            {imageUrl && (
                <div className="mt-5">
                    <h2 className="text-lg font-semibold">✨ 생성된 이미지:</h2>
                    <img src={imageUrl} alt="Generated" className="mt-3 w-96 rounded-lg shadow-lg" />
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;
