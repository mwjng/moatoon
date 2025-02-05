import React, { useState } from "react";
import BookStoryGenerator from "../components/BookStoryGenerator";

const moods = ["신비로운", "따뜻한", "평화로운", "호기심", "모험적인", "놀라운", "유쾌한", "시끌벅적"];
const themes = ["공주/왕자", "공룡", "동물", "마법", "요정", "우주", "바다", "사막", "하늘", "용기", "민속", "중세", "요리", "역할극", "영웅", "로봇", "자동차"];
const genres = ["모험", "판타지", "로맨스", "신화", "역사", "일상", "코믹", "액션", "드라마", "스포츠"];
const difficultyLevels = [1, 2, 3, 4, 5, 6];

const wordList = [
    "마법", "친구", "용기", "빛", "모험", "비밀", "책", "바람", "강", "돌", 
    "별", "사탕", "숲", "나무", "하늘", "모래", "물", "음악", "춤", "노래", 
    "구름", "불", "토끼", "사자", "왕", "여왕", "용", "배", "섬", "바다", 
    "모자", "열쇠", "문", "꽃", "나비", "별빛", "그림자", "소원", "마을", "꿈", 
    "신비", "보물", "길", "여행", "친절", "강아지", "고양이", "눈", "눈사람", "새"
];

const BookGeneratorPage = () => {
    const [mood, setMood] = useState("");
    const [theme, setTheme] = useState("");
    const [genre, setGenre] = useState("");
    const [difficulty, setDifficulty] = useState(1);
    const [length, setLength] = useState(3);  // 기본 분량 설정 (챕터 수)
    const [story, setStory] = useState(null);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const getRandomWords = (count) => {
        let shuffled = [...wordList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const handleGenerateStory = async () => {
        setIsGenerating(true);

        const totalWords = 4 * length;  // 분량에 맞는 단어 개수
        const selectedWords = getRandomWords(totalWords);

        let chapters = [];
        for (let i = 0; i < length; i++) {
            const chapterWords = selectedWords.slice(i * 4, (i + 1) * 4);
            chapters.push(`- CH${i + 1}: 이 챕터의 주요 단어: ${chapterWords.join(", ")}`);
        }

        const ageGroup = difficulty === 1 ? "4~6세" : difficulty === 2 ? "7세" : "8세 이상";

        const prompt = `당신은 동화 작가입니다. 
        - ${mood} 분위기의 ${theme} 테마를 가진 ${genre} 장르의 동화를 작성해주세요.
        - 이야기의 난이도는 (${ageGroup}) 수준이야.
        - 이야기는 총 ${length}개의 챕터로 나누어집니다.
        - 이야기의 개요는 5줄 내외로 작성해주세요.
        - 각 챕터는 4개의 단어를 포함하며, 이 단어들은 서로 겹치지 않습니다.
        - 각 챕터는 4개의 문단으로 이루어지며, 각 문단에는 챕터의 단어 중 하나 이상이 반드시 포함되어야 합니다.
        
        예시:
         1. 개요
        한 소년이 마법의 숲에 들어가게되었어요. 그 소년은 숲의 동물들과 친구가 될 수 있을까요? 
        2. CH1
        어느 날, 소년은 마법의 숲에 들어가게 되었습니다. 그곳에서 소년은 노란색 토끼와 파란색 새와 만났습니다. 
        3. CH2
        토끼와 새는 소년을 환영하며 함께 노래를 불렀어요. 소년은 감동하여 눈물을 흘렸고, 그들과 우정을 맺게 되었어요.

        ${chapters.join("\n")}`;

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
                    max_tokens: 600,
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

            {/* 난이도 선택 */}
            <div className="mt-4">
                <label className="block font-semibold">난이도</label>
                <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))} className="p-2 border rounded-md">
                    {difficultyLevels.map(d => <option key={d} value={d}>{d}단계</option>)}
                </select>
            </div>

            {/* 분량 선택 */}
            <div className="mt-4">
                <label className="block font-semibold">분량 (챕터 수)</label>
                <input type="number" min="1" max="10" value={length} onChange={(e) => setLength(parseInt(e.target.value))}
                    className="p-2 border rounded-md w-16" />
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
