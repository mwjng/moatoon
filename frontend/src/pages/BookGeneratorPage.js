import React, { useState } from "react";
import BookStoryGenerator from "../components/BookStoryGenerator";

const moods = ["신비로운", "따뜻한", "평화로운", "호기심", "모험적인", "놀라운", "유쾌한", "시끌벅적"];
const themes = ["공주/왕자", "공룡", "동물", "마법", "요정", "우주", "바다", "사막", "하늘", "용기", "민속", "중세", "요리", "역할극", "영웅", "로봇", "자동차"];
const genres = ["모험", "판타지", "로맨스", "신화", "역사", "일상", "코믹", "액션", "드라마", "스포츠"];
const difficultyLevels = [1, 2, 3, 4, 5, 6];

const BookGeneratorPage = () => {
    const [mood, setMood] = useState("");
    const [theme, setTheme] = useState("");
    const [genre, setGenre] = useState("");
    const [difficulty, setDifficulty] = useState(1);
    const [story, setStory] = useState(null);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateStory = async () => {
        setIsGenerating(true);

        const prompt = `당신은 동화 작가입니다. 
        - ${mood} 분위기의 ${theme} 테마를 가진 ${genre} 장르의 동화를 작성해주세요.
        - 이야기의 난이도는 ${difficulty}단계 (레벨1=4~6세, 레벨2=7세, 레벨3=8세 이상).
        - 이야기는 5줄 내외의 개요, 챕터1, 챕터2,,, 이렇게 진행됩니다.`;

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            setStory(data.choices[0]?.message?.content || "스토리 생성 실패");
            setShowStoryGenerator(true);
        } catch (error) {
            console.error("이야기 생성 오류:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-10 bg-blue-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 AI 동화책 생성</h1>

            {/* 키워드 선택 */}
            <div className="mt-4">
                <label className="block font-semibold">키워드</label>
                <div className="flex space-x-4">
                    <select value={mood} onChange={(e) => setMood(e.target.value)} className="p-2 border rounded-md">
                        {moods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="p-2 border rounded-md">
                        {themes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} className="p-2 border rounded-md">
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
            </div>

            {/* 생성 버튼 */}
            <button onClick={handleGenerateStory} className="mt-6 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg">
                {isGenerating ? "생성 중..." : "생성하기"}
            </button>

            {/* 스토리 모달 */}
            {showStoryGenerator && <BookStoryGenerator story={story} onClose={() => setShowStoryGenerator(false)} />}
        </div>
    );
};

export default BookGeneratorPage;
