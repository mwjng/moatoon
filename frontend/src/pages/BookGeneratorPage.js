import React, { useState } from "react";
import BookStoryGenerator from "../components/BookStoryGenerator";

// 옵션 배열들
const moods = ["신비로운", "따뜻한", "평화로운", "호기심", "모험적인", "놀라운", "유쾌한", "시끌벅적"];
const themes = ["공주/왕자", "공룡", "동물", "마법", "요정", "우주", "바다", "사막", "하늘", "용기", "민속", "중세", "요리", "역할극", "영웅", "로봇", "자동차"];
const genres = ["모험", "판타지", "로맨스", "신화", "역사", "일상", "코믹", "액션", "드라마", "스포츠"];
const difficultyLevels = [1, 2, 3, 4, 5, 6];

// 드롭다운 옵션
const levelOptions = ["Lv1 (4~6세)", "Lv2 (7세)", "Lv3 (8세)", "Lv4 (9세)", "Lv5 (10세)", "Lv6 (11세)"];
// 에피소드 분량: 2~10
const episodeOptions = Array.from({ length: 9 }, (_, i) => i + 2);
const publicStatusOptions = ["공개", "비공개"];
const childrenOptions = ["김싸피", "배현수"];
const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];

const BookGeneratorPage = () => {
  // 추가 정보 상태
  const [startDate, setStartDate] = useState("");
  const [level, setLevel] = useState(levelOptions[0]);
  const [episodeLength, setEpisodeLength] = useState(episodeOptions[0]); // 기본값 2
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]); // 배열 (체크박스)
  const [publicStatus, setPublicStatus] = useState(publicStatusOptions[0]);
  // 참여할 아동은 단일 값이 아닌 배열로 관리 (여러 명 선택)
  const [participatingChildren, setParticipatingChildren] = useState([]);

  // 기존 정보 상태
  const [mood, setMood] = useState("");
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("");
  const [difficulty, setDifficulty] = useState(1);

  // 모달 표시 여부
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);

  // 요일 체크박스 토글 함수
  const handleToggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // 시간 옵션 생성 (09:00 ~ 22:00, 30분 단위)
  const generateAllTimeOptions = () => {
    let times = [];
    for (let hour = 9; hour <= 22; hour++) {
      times.push(`${String(hour).padStart(2, "0")}:00`);
      if (hour < 22) times.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return times;
  };

  // 시작일이 오늘인 경우 현재 시간 + 1시간 이후 옵션 필터링
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

  // 시간 선택 시, 시작일 미선택 시 알림
  const handleTimeChange = (e) => {
    if (!startDate) {
      alert("방 시작일을 먼저 선택해주세요");
      return;
    }
    setTime(e.target.value);
  };

  // 아동 선택 시, 이미 선택되지 않은 경우 배열에 추가
  const handleAddChild = (e) => {
    const selectedChild = e.target.value;
    if (selectedChild && !participatingChildren.includes(selectedChild)) {
      setParticipatingChildren([...participatingChildren, selectedChild]);
    }
    // 선택 후 드롭다운의 기본값(빈 값)으로 리셋
    e.target.value = "";
  };

  // 생성하기 버튼 클릭 시, 모든 필수 요소가 선택되었는지 확인 후 모달 열기
  const handleSubmit = () => {
    if (
      !startDate ||
      !time ||
      selectedDays.length === 0 ||
      participatingChildren.length === 0 ||
      !mood ||
      !theme ||
      !genre
    ) {
      alert("모든 요소를 선택하세요");
      return;
    }
    setShowStoryGenerator(true);
  };

  return (
    <div className="flex flex-col items-center p-10 bg-blue-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📖 AI 동화책 생성</h1>

      {/* 추가 정보 입력 */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        <div>
          <label className="block font-semibold">방 시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setTime(""); // 시작일 변경 시 시간 초기화
            }}
            className="p-2 border rounded-md w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">레벨</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            {levelOptions.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">에피소드 분량</label>
          <select
            value={episodeLength}
            onChange={(e) => setEpisodeLength(parseInt(e.target.value))}
            className="p-2 border rounded-md w-full"
          >
            {episodeOptions.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">시간</label>
          <select
            value={time}
            onChange={handleTimeChange}
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
        <div className="col-span-2">
          <label className="block font-semibold">요일 (여러 개 선택 가능)</label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day) => (
              <label
                key={day}
                className="flex items-center gap-1 p-2 border rounded-md bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleToggleDay(day)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-semibold">공개 여부</label>
          <select
            value={publicStatus}
            onChange={(e) => setPublicStatus(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            {publicStatusOptions.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
        {/* 참여할 아동 선택: 드롭다운에서 선택 시 배열에 추가 */}
        <div>
          <label className="block font-semibold">참여할 아동</label>
          <select onChange={handleAddChild} className="p-2 border rounded-md w-full">
            <option value="">아동 선택</option>
            {childrenOptions.map((child) => (
              <option key={child} value={child}>
                {child}
              </option>
            ))}
          </select>
          {/* 선택된 아동들을 태그 형태로 보여주기 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {participatingChildren.map((child) => (
              <span
                key={child}
                className="flex items-center bg-gray-200 px-2 py-1 rounded-full text-sm"
              >
                {child}
                <button
                  onClick={() =>
                    setParticipatingChildren(
                      participatingChildren.filter((c) => c !== child)
                    )
                  }
                  className="ml-1 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 기존 정보 입력: 분위기, 테마, 장르, 난이도 */}
      <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xl">
        <div>
          <label className="block font-semibold">분위기</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">분위기 선택</option>
            {moods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">테마</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">테마 선택</option>
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">장르</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">장르 선택</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        {/* 난이도 선택 부분은 주석 처리되어 있음 */}
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg"
      >
        생성하기
      </button>

      {/* BookStoryGenerator 모달 열기 */}
      {showStoryGenerator && (
        <BookStoryGenerator
          // 추가 정보 전달
          startDate={startDate}
          level={level}
          episodeLength={episodeLength}
          time={time}
          dayOfWeek={selectedDays}  // 배열로 전달
          publicStatus={publicStatus}
          participatingChildren={participatingChildren}  // 배열로 전달
          // 기존 정보 전달
          mood={mood}
          theme={theme}
          genre={genre}
          difficulty={difficulty}
          // episodeLength를 챕터 수로 사용
          onClose={() => setShowStoryGenerator(false)}
        />
      )}
    </div>
  );
};

export default BookGeneratorPage;
