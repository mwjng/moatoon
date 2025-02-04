import React, { useState } from "react";
import BookStoryGenerator from "../components/BookStoryGenerator";

const BookGeneratorPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [episodeCount, setEpisodeCount] = useState(4);
    const [weekday, setWeekday] = useState("월요일");
    const [mood, setMood] = useState("");
    const [theme, setTheme] = useState("");
    const [genre, setGenre] = useState("");
    const [difficulty, setDifficulty] = useState(1);
    const [timeSlot, setTimeSlot] = useState("10:00 AM");
    const [participants, setParticipants] = useState([]);

    const [story, setStory] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);

    const handleGenerateStory = async () => {
        setIsGenerating(true);

        // OpenAI API 호출을 위한 프롬프트
        const prompt = `에피소드 ${episodeCount}개, 분위기: ${mood}, 테마: ${theme}, 장르: ${genre}로 구성된 동화를 만들어줘.`;

        try {
            const response = await fetch("https://api.openai.com/v1/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    prompt,
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            setStory(data.choices[0].text);
            setShowStoryGenerator(true);
        } catch (error) {
            console.error("이야기 생성 오류:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-10">
            <h1 className="text-3xl font-bold">📖 AI 책 생성기</h1>

            {/* 에피소드 선택 */}
            <label>에피소드 분량</label>
            <select value={episodeCount} onChange={(e) => setEpisodeCount(parseInt(e.target.value))}>
                {[4, 6, 8, 10].map(num => <option key={num} value={num}>{num}</option>)}
            </select>

            {/* 키워드 선택 */}
            <label>분위기</label>
            <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} />

            <label>테마</label>
            <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} />

            <label>장르</label>
            <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />

            {/* 생성 버튼 */}
            <button
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg"
                onClick={handleGenerateStory}
                disabled={isGenerating}
            >
                {isGenerating ? "생성 중..." : "생성하기"}
            </button>

            {/* 스토리 생성기 모달 */}
            {showStoryGenerator && <BookStoryGenerator story={story} />}
        </div>
    );
};

export default BookGeneratorPage;
