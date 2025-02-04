import React, { useState } from "react";
import BookStoryGenerator from "../components/BookStoryGenerator";

const moods = ["신비로운", "따뜻한", "평화로운", "호기심", "모험적인", "놀라운", "유쾌한", "시끌벅적"];
const themes = ["공주/왕자", "공룡", "동물", "마법", "요정", "우주", "바다", "사막", "하늘", "용기", "민속", "중세", "요리", "역할극", "영웅", "로봇", "자동차"];
const genres = ["모험", "판타지", "로맨스", "신화", "역사", "일상", "코믹", "액션", "드라마", "스포츠"];
const difficultyLevels = [1, 2, 3, 4, 5, 6];
const episodeCounts = [2, 3, 4];
const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"];

const BookGeneratorPage = () => {
    const [startDate, setStartDate] = useState("");
    const [episodeCount, setEpisodeCount] = useState(2);
    const [selectedDays, setSelectedDays] = useState([]);
    const [mood, setMood] = useState("");
    const [theme, setTheme] = useState("");
    const [genre, setGenre] = useState("");
    const [difficulty, setDifficulty] = useState(1);
    const [timeSlot, setTimeSlot] = useState("");
    const [story, setStory] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleGenerateStory = async () => {
        setIsGenerating(true);

        const prompt = `
        "분위기: ${mood}, 테마: ${theme}, 장르: ${genre}에 맞춘 ${episodeCount}개 에피소드의 동화책을 작성해줘. 
        이야기의 난이도는 ${difficulty}단계(레벨1이면 4~6세용, 레벨2는 7세용, 레벨3은 8세용 등으로 설정).
        챕터는 서로 연결된 이야기로 구성.이야기의 구성은 5줄내외의 개요, 챕터1, 챕터2,,,이렇게 진행돼."`;

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
            console.log("프롬프트 : ", prompt);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-10 bg-blue-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 방 생성</h1>

            {/* 시작일 & 난이도 */}
            <div className="flex space-x-6">
                <div>
                    <label className="block font-semibold">시작일</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-semibold">난이도</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="p-2 border rounded-md">
                        {difficultyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                </div>
            </div>

            {/* 에피소드 분량 & 시간 */}
            <div className="flex space-x-6 mt-4">
                <div>
                    <label className="block font-semibold">에피소드 분량</label>
                    <select value={episodeCount} onChange={(e) => setEpisodeCount(parseInt(e.target.value))} className="p-2 border rounded-md">
                        {episodeCounts.map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block font-semibold">시간</label>
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="p-2 border rounded-md">
                        {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                </div>
            </div>

            {/* 요일 선택 */}
            <div className="mt-4">
                <label className="block font-semibold">요일</label>
                <div className="flex space-x-2">
                    {["월", "화", "수", "목", "금", "토", "일"].map(day => (
                        <button key={day} onClick={() => toggleDay(day)} className={`px-3 py-1 border rounded-md ${selectedDays.includes(day) ? "bg-blue-500 text-white" : "bg-white"}`}>
                            {day}
                        </button>
                    ))}
                </div>
            </div>

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
            {showStoryGenerator && <BookStoryGenerator story={story} />}
        </div>
    );
};

export default BookGeneratorPage;
