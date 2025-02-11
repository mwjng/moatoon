import React, { useEffect, useState } from "react";
import BookStoryGenerator from "../components/BookStoryGenerator";
import { fetchKeywords } from "../api/keyword"; // 키워드 API 호출

const levelOptions = ["Lv1 (4~6세)", "Lv2 (7세)", "Lv3 (8세)", "Lv4 (9세)", "Lv5 (10세)", "Lv6 (11세)"];
const episodeOptions = Array.from({ length: 9 }, (_, i) => i + 2);
const publicStatusOptions = ["공개", "비공개"];
const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];

const BookGeneratorPage = () => {
  // 키워드 상태
  const [moods, setMoods] = useState([]);
  const [themes, setThemes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // 기본 상태
  const [startDate, setStartDate] = useState("");
  const [level, setLevel] = useState(levelOptions[0]);
  const [episodeLength, setEpisodeLength] = useState(episodeOptions[0]);
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [publicStatus, setPublicStatus] = useState(publicStatusOptions[0]);
  const [selectedChildren, setSelectedChildren] = useState([]);

  // 기존 정보 상태
  const [mood, setMood] = useState("");
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);

  // 참여할 아동 리스트 (임시 데이터)
  const childrenOptions = [
    { id: 3, name: "배현수" },
    { id: 4, name: "배현지" }
  ];

  // 🔹 키워드 API 요청
  useEffect(() => {
    const loadKeywords = async () => {
      try {
        const keywords = await fetchKeywords();
        const moodList = [];
        const themeList = [];
        const genreList = [];

        keywords.forEach(({ id, keyword, option }) => {
          const entry = { id, keyword };
          if (option === "MOOD") moodList.push(entry);
          if (option === "THEME") themeList.push(entry);
          if (option === "GENRE") genreList.push(entry);
        });

        setMoods(moodList);
        setThemes(themeList);
        setGenres(genreList);
      } catch (error) {
        console.error("키워드 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadKeywords();
  }, []);

  // 🔹 요일 체크박스 토글
  const handleToggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // 🔹 아동 선택
  const handleAddChild = (e) => {
    const selectedChild = childrenOptions.find(child => child.id === parseInt(e.target.value));
    if (selectedChild && !selectedChildren.some(c => c.id === selectedChild.id)) {
      setSelectedChildren([...selectedChildren, selectedChild]);
    }
  };

  // 🔹 제출 버튼 클릭 시 검증
  const handleSubmit = () => {
    if (!startDate || !time || !mood || !theme || !genre || selectedChildren.length === 0 || selectedDays.length === 0) {
      alert("모든 요소를 선택하세요");
      return;
    }
    setShowStoryGenerator(true);
  };

    // 🔹 시간 드롭다운 옵션 생성 (09:00 ~ 22:00, 30분 단위)
    const generateAllTimeOptions = () => {
      let times = [];
      for (let hour = 9; hour <= 22; hour++) {
        times.push(`${String(hour).padStart(2, "0")}:00`);
        if (hour < 22) times.push(`${String(hour).padStart(2, "0")}:30`);
      }
      return times;
    };
  
    // 🔹 현재 선택한 날짜가 오늘이면, 현재 시간 + 1시간 이후만 선택 가능하도록 필터링
    const availableTimeOptions = (() => {
      const allTimes = generateAllTimeOptions();
      if (!startDate) return allTimes;
      const todayStr = new Date().toISOString().split("T")[0];
      if (startDate === todayStr) {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        return allTimes.filter((option) => {
          const [hour, minute] = option.split(":").map(Number);
          const optionDate = new Date(startDate);
          optionDate.setHours(hour, minute, 0, 0);
          return optionDate > oneHourLater;
        });
      }
      return allTimes;
    })();

  return (
    <div className="flex flex-col items-center p-10 bg-blue-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 AI 동화책 생성</h1>

      {loading ? (
        <p className="text-gray-500">키워드 불러오는 중...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
            <div>
              <label className="block font-semibold">방 시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div>
              <label className="block font-semibold">레벨</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="p-2 border rounded-md w-full">
                {levelOptions.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

             {/* 시간 선택 드롭다운 */}
             <div className="flex-1">
                <label className="block font-semibold">시간</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!startDate}
                  className="p-2 border rounded-md w-full"
                >
                  <option value="">시간 선택</option>
                  {availableTimeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
      <label className="block font-semibold">참여할 아동</label>
      <select onChange={handleAddChild} className="p-2 border rounded-md w-full">
        <option value="">아동 선택</option>
        {childrenOptions.map(({ id, name }) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>
      {/* 선택된 아동 태그 표시 */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedChildren.map(({ id, name }) => (
          <span key={id} className="flex items-center bg-gray-200 px-2 py-1 rounded-full text-sm">
            {name}
            <button
              onClick={() => setSelectedChildren(selectedChildren.filter(c => c.id !== id))}
              className="ml-1 text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
    
    <div>
      <label className="block font-semibold">에피소드 수</label>
      <select
        value={episodeLength}
        onChange={(e) => setEpisodeLength(parseInt(e.target.value))}
        className="p-2 border rounded-md w-full"
      >
        {episodeOptions.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block font-semibold">공개 여부</label>
      <div className="flex gap-4">
        {["공개", "비공개"].map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              value={option}
              checked={publicStatus === option}
              onChange={() => setPublicStatus(option)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
            

            {/* 요일 선택 */}
            <div className="col-span-2">
              <label className="block font-semibold">요일 (여러 개 선택 가능)</label>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map((day) => (
                  <label key={day} className="flex items-center gap-1 p-2 border rounded-md bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => handleToggleDay(day)} />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 분위기 선택 */}
            <div>
              <label className="block font-semibold">분위기</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)} className="p-2 border rounded-md w-full">
                <option value="">분위기 선택</option>
                {moods.map(({ id, keyword }) => (
                  <option key={id} value={id}>{keyword}</option>
                ))}
              </select>
            </div>

            {/* 테마 선택 */}
            <div>
              <label className="block font-semibold">테마</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="p-2 border rounded-md w-full">
                <option value="">테마 선택</option>
                {themes.map(({ id, keyword }) => (
                  <option key={id} value={id}>{keyword}</option>
                ))}
              </select>
            </div>

            {/* 장르 선택 */}
            <div>
              <label className="block font-semibold">장르</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value)} className="p-2 border rounded-md w-full">
                <option value="">장르 선택</option>
                {genres.map(({ id, keyword }) => (
                  <option key={id} value={id}>{keyword}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleSubmit} className="mt-6 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg">
            생성하기
          </button>
        </>
      )}

{showStoryGenerator && (
  <BookStoryGenerator
    startDate={startDate}
    level={level}
    episodeLength={episodeLength}
    time={time}
    dayOfWeek={selectedDays}
    publicStatus={publicStatus}
    participatingChildren={selectedChildren}
    mood={mood}
    theme={theme}
    genre={genre}
    difficulty={difficulty}
    onClose={() => setShowStoryGenerator(false)}
  />
)}
    </div>
  );
};

export default BookGeneratorPage;
