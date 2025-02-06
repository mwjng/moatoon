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
  const [length, setLength] = useState(3); // 기본 분량 설정 (챕터 수)
  const [story, setStory] = useState(null);
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const getRandomWords = (count) => {
    let shuffled = [...wordList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleGenerateStory = async () => {
    setIsGenerating(true);

    const totalWords = 4 * length; // 분량에 맞는 단어 개수
    const selectedWords = getRandomWords(totalWords);

    let chapters = [];
    for (let i = 0; i < length; i++) {
      const chapterWords = selectedWords.slice(i * 4, (i + 1) * 4);
      chapters.push(`- CH${i + 1}: 이 챕터의 주요 단어: ${chapterWords.join(", ")}`);
    }

    const ageGroup = difficulty === 1 ? "4~6세" : difficulty === 2 ? "7세" : difficulty === 3 ? "8세" : difficulty === 4 ? "9세": difficulty === 5 ? "10세": "11세";

    const prompt = `
역할: ${mood} 분위기의 ${theme} 테마 ${genre} 동화를 작성하는 동화 작가.
- 난이도: (${ageGroup}) 수준.
- 구성:

- 개요: 5줄 내외.

- 챕터: 총 ${length}개, 각 챕터마다 4문장으로 구성.

- 사용 단어:

- 각 챕터마다 4개의 단어(동사는 원형 사용; 문장 내에서는 변형 가능)를 "<사용 단어: ...>"형식으로 제공.

- 각 문장에는 해당 단어를 볼드체로 포함 (단어들은 중복 없이 각 문장마다 한 개씩).

- *출력 예시 (각 섹션을 "---" 구분자로 나누어 주세요):**

1. 개요

한 소년이 마법의 숲에 들어갔어요.

숲에서 동물 친구들을 만났어요.

모험이 시작되었어요.

새로운 우정을 쌓아갈 수 있을까요?

- -- 

2. CH1

<사용 단어: "마법", "노란색", "부르다", "돌아가다">

(1) 소년은 **마법**의 숲에 들어갔어요.

(2) 숲에서 **노란색** 토끼를 만났어요.

(3) 소년은 토끼를 **불렀어요**.

(4) 모두와 함께 집으로 **돌아갔어요**.

- -- 

3. CH2

<사용 단어: "친구", "함께", "약속", "모이다">

(1) 다음날, 소년은 **친구**에게 이야기를 전해줬어요.

(2) 친구는 **함께** 가고 싶다고 했어요.

(3) 소년은 친구에게 함께 가자고 **약속**했어요.

(4) 그리고 다음날 아침에 둘은 숲 앞에 **모였어요**.
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

      const data = await response.json(); //생성된 데이터
      setStory(data.choices[0]?.message?.content || "스토리 생성 실패"); //data.choices[0]?.message?.content 기 생성된 스토리 내용임. -> Story로 저장됨(set에 의해해)
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
      {showStoryGenerator && (
        <BookStoryGenerator
          story={story}
          onClose={() => setShowStoryGenerator(false)}
          mood={mood}
          theme={theme}
          genre={genre}
          difficulty={difficulty}
          length={length}
        />
      )}
    </div>
  );
};

export default BookGeneratorPage;
