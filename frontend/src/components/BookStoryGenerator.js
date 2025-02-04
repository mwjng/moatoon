import React, { useState } from "react";

const BookStoryGenerator = () => {
    const [story, setStory] = useState("");

    const generateStory = () => {
        setStory("📝 AI가 생성한 스토리 내용이 여기에 표시됩니다...");
    };

    return (
        <div className="flex flex-col items-center p-10 border rounded-lg shadow-lg mt-6">
            <h1 className="text-3xl font-bold">📚 스토리 생성기</h1>
            <p className="mt-4">AI를 사용하여 맞춤형 스토리를 생성해보세요.</p>

            <button
                className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={generateStory}
            >
                스토리 생성
            </button>

            {story && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-100 w-3/4">
                    <p>{story}</p>
                </div>
            )}
        </div>
    );
};

export default BookStoryGenerator;
