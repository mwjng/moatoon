import React, { useState, useEffect } from "react";
import { fetchKeywords } from "../../api/keyword";

const levelOptions = ["Lv1 (4~6세)", "Lv2 (7세)", "Lv3 (8세)", "Lv4 (9세)", "Lv5 (10세)", "Lv6 (11세)"];
const episodeOptions = Array.from({ length: 9 }, (_, i) => i + 2);
const publicStatusOptions = ["공개", "비공개"];
const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];
const childrenOptions = [
  { id: 3, name: "배현수" },
  { id: 4, name: "배현지" },
];

const BookForm = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState("");
  const [level, setLevel] = useState(levelOptions[0]);
  const [episodeLength, setEpisodeLength] = useState(episodeOptions[0]);
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [publicStatus, setPublicStatus] = useState(publicStatusOptions[0]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [mood, setMood] = useState("");
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [moods, setMoods] = useState([]);
  const [themes, setThemes] = useState([]);
  const [genres, setGenres] = useState([]);

  // 🔹 API에서 키워드 가져오기
  useEffect(() => {
    const loadKeywords = async () => {
      try {
        const keywords = await fetchKeywords();
        setMoods(keywords.filter(k => k.option === "MOOD"));
        setThemes(keywords.filter(k => k.option === "THEME"));
        setGenres(keywords.filter(k => k.option === "GENRE"));
      } catch (error) {
        console.error("키워드 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadKeywords();
  }, []);

  // 🔹 시간 드롭다운 옵션 생성 (09:00 ~ 22:00, 30분 단위)
  const generateTimeOptions = () => {
    let times = [];
    for (let hour = 9; hour <= 22; hour++) {
      times.push(`${String(hour).padStart(2, "0")}:00`);
      if (hour < 22) times.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return times;
  };

  // 🔹 선택된 날짜가 오늘이면 한 시간 이후 시간대만 선택 가능하도록 필터링
  const availableTimeOptions = (() => {
    const allTimes = generateTimeOptions();
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

  // 🔹 폼 제출
  const handleSubmit = () => {
    if (!startDate || !time || !mood || !theme || !genre || selectedChildren.length === 0 || selectedDays.length === 0) {
      alert("모든 요소를 선택하세요");
      return;
    }
    onSubmit({
      startDate,
      level,
      episodeLength,
      time,
      dayOfWeek: selectedDays,
      publicStatus,
      participatingChildren: selectedChildren,
      mood,
      theme,
      genre,
      difficulty,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
      {/* 📌 방 시작일 선택 */}
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded-md w-full" />

      {/* 📌 시간 선택 */}
      <select value={time} onChange={(e) => setTime(e.target.value)} disabled={!startDate} className="p-2 border rounded-md w-full">
        <option value="">시간 선택</option>
        {availableTimeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>

      {/* 📌 참여 아동 선택 */}
      <select onChange={(e) => {
        const child = childrenOptions.find(c => c.id === parseInt(e.target.value));
        if (child && !selectedChildren.some(c => c.id === child.id)) {
          setSelectedChildren([...selectedChildren, child]);
        }
      }} className="p-2 border rounded-md w-full">
        <option value="">아동 선택</option>
        {childrenOptions.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
      </select>

      {/* 선택된 아동 목록 */}
      <div className="flex flex-wrap gap-2">
        {selectedChildren.map(({ id, name }) => (
          <span key={id} className="px-2 py-1 bg-gray-200 rounded">{name}</span>
        ))}
      </div>

      {/* 📌 요일 선택 */}
      <div>
        {dayOptions.map(day => (
          <label key={day} className="mr-2">
            <input type="checkbox" checked={selectedDays.includes(day)} onChange={() =>
              setSelectedDays(selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day])
            } /> {day}
          </label>
        ))}
      </div>

      {/* 📌 분위기 선택 */}
      <select value={mood} onChange={(e) => setMood(e.target.value)} className="p-2 border rounded-md w-full">
        <option value="">분위기 선택</option>
        {moods.map(({ id, keyword }) => <option key={id} value={id}>{keyword}</option>)}
      </select>

      {/* 📌 테마 선택 */}
      <select value={theme} onChange={(e) => setTheme(e.target.value)} className="p-2 border rounded-md w-full">
        <option value="">테마 선택</option>
        {themes.map(({ id, keyword }) => <option key={id} value={id}>{keyword}</option>)}
      </select>

      {/* 📌 장르 선택 */}
      <select value={genre} onChange={(e) => setGenre(e.target.value)} className="p-2 border rounded-md w-full">
        <option value="">장르 선택</option>
        {genres.map(({ id, keyword }) => <option key={id} value={id}>{keyword}</option>)}
      </select>

      {/* 📌 공개 여부 선택 */}
      <div className="col-span-2">
        {publicStatusOptions.map(option => (
          <label key={option} className="mr-4">
            <input type="radio" value={option} checked={publicStatus === option} onChange={() => setPublicStatus(option)} /> {option}
          </label>
        ))}
      </div>

      {/* 제출 버튼 */}
      <button onClick={handleSubmit} className="mt-6 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg col-span-2">생성하기</button>
    </div>
  );
};

export default BookForm;
