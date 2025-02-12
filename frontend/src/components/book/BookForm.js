import React, { useState, useEffect } from 'react';
import { fetchKeywords } from '../../api/party';
import { GiCancel } from 'react-icons/gi';

const levelOptions = ['Lv1 (4~6세)', 'Lv2 (7세)', 'Lv3 (8세)', 'Lv4 (9세)', 'Lv5 (10세)', 'Lv6 (11세)'];
const episodeOptions = Array.from({ length: 9 }, (_, i) => i + 2);
const publicStatusOptions = ['공개', '비공개'];
const dayOptions = ['월', '화', '수', '목', '금', '토', '일'];
const childrenOptions = [
    { id: 13, name: '배자식' },
    { id: 4, name: '배현지' },
];

const BookForm = ({ onSubmit, selectTimeHandler, closeModal }) => {
    const [startDate, setStartDate] = useState('');
    const [level, setLevel] = useState(levelOptions[0]);
    const [episodeLength, setEpisodeLength] = useState(episodeOptions[0]);
    const [time, setTime] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [publicStatus, setPublicStatus] = useState(publicStatusOptions[0]);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [mood, setMood] = useState('');
    const [theme, setTheme] = useState('');
    const [genre, setGenre] = useState('');
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
                setMoods(keywords.filter(k => k.option === 'MOOD'));
                setThemes(keywords.filter(k => k.option === 'THEME'));
                setGenres(keywords.filter(k => k.option === 'GENRE'));
            } catch (error) {
                console.error('키워드 로딩 실패:', error);
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
            times.push(`${String(hour).padStart(2, '0')}:00`);
            if (hour < 22) times.push(`${String(hour).padStart(2, '0')}:30`);
        }
        return times;
    };

    // 🔹 선택된 날짜가 오늘이면 한 시간 이후 시간대만 선택 가능하도록 필터링
    const availableTimeOptions = (() => {
        const allTimes = generateTimeOptions();
        if (!startDate) return allTimes;
        const todayStr = new Date().toISOString().split('T')[0];
        if (startDate === todayStr) {
            const now = new Date();
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            return allTimes.filter(option => {
                const [hour, minute] = option.split(':').map(Number);
                const optionDate = new Date(startDate);
                optionDate.setHours(hour, minute, 0, 0);
                return optionDate > oneHourLater;
            });
        }
        return allTimes;
    })();

    // 🔹 폼 제출
    const handleSubmit = () => {
        if (
            !startDate ||
            !time ||
            !mood ||
            !theme ||
            !genre ||
            selectedChildren.length === 0 ||
            selectedDays.length === 0
        ) {
            alert('모든 요소를 선택하세요');
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

    const deleteChild = id => {
        setSelectedChildren(selectedChildren.filter(child => child.id != id));
    };

    return (
        <>
            <div className="grid grid-cols-[1fr 50%] gap-x-2 gap-y-6 w-full ">
                {/* 📌 방 시작일 선택 */}
                <div className="flex items-center">
                    <label htmlFor="start" className="w-[120px]">
                        시작일
                    </label>
                    <input
                        id="start"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-[50%] bg-white"
                    />
                </div>
                {/* 📌 시간 선택 */}
                <div className="flex items-center">
                    <label htmlFor="time" className="w-[120px]">
                        시간
                    </label>
                    <select
                        id="time"
                        value={time}
                        onMouseDown={e => !startDate && (e.preventDefault(), selectTimeHandler())}
                        onChange={e => setTime(e.target.value)}
                        className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-[50%] bg-white"
                    >
                        <option value="">시간 선택</option>
                        {availableTimeOptions.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                {/* 📌 에피소드 분량 선택 */}
                <div className="flex items-center">
                    <label htmlFor="length" className="w-[120px]">
                        에피소드 분량
                    </label>
                    <select
                        id="length"
                        value={episodeLength}
                        onChange={e => setEpisodeLength(parseInt(e.target.value))}
                        className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-[50%] bg-white"
                    >
                        {episodeOptions.map(op => (
                            <option key={op} value={op}>
                                {op}
                            </option>
                        ))}
                    </select>
                </div>
                {/* 📌 난이도 선택 */}
                <div className="flex items-center">
                    <label htmlFor="level" className="w-[120px]">
                        레벨
                    </label>
                    <select
                        id="level"
                        value={level}
                        onChange={e => setLevel(e.target.value)}
                        className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-[50%] bg-white"
                    >
                        {levelOptions.map(op => (
                            <option key={op} value={op}>
                                {op}
                            </option>
                        ))}
                    </select>
                </div>
                {/* 📌 요일 선택 */}
                <div className="flex items-center">
                    <label htmlFor="select-day" className="w-[120px]">
                        진행 요일
                    </label>
                    <div
                        id="select-day"
                        className="flex justify-between w-[60%] rounded-xl p-2 pl-3 pr-3 bg-white border-[2px]"
                    >
                        {dayOptions.map(day => (
                            <label key={day} className="mr-3">
                                <input
                                    type="checkbox"
                                    checked={selectedDays.includes(day)}
                                    onChange={() =>
                                        setSelectedDays(
                                            selectedDays.includes(day)
                                                ? selectedDays.filter(d => d !== day)
                                                : [...selectedDays, day],
                                        )
                                    }
                                />{' '}
                                {day}
                            </label>
                        ))}
                    </div>
                </div>
                {/* 📌 공개 여부 선택 */}
                <div className="flex items-center">
                    <label htmlFor="select-open" className="w-[120px]">
                        공개 여부
                    </label>
                    <div className="col-span-2" id="select-open">
                        {publicStatusOptions.map(option => (
                            <label key={option} className="mr-4">
                                <input
                                    type="radio"
                                    value={option}
                                    checked={publicStatus === option}
                                    onChange={() => setPublicStatus(option)}
                                />{' '}
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center">
                    <label className="w-[120px]" htmlFor="select-keyword">
                        키워드
                    </label>
                    {/* 📌 분위기 선택 */}
                    <div className="flex flex-col w-[50%] gap-2 " id="select-keyword">
                        <select
                            value={mood}
                            onChange={e => setMood(e.target.value)}
                            className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-full bg-white"
                        >
                            <option value="" disabled>
                                분위기 선택
                            </option>
                            {moods.map(({ id, keyword }) => (
                                <option key={id} value={id}>
                                    {keyword}
                                </option>
                            ))}
                        </select>

                        {/* 📌 테마 선택 */}
                        <select
                            value={theme}
                            onChange={e => setTheme(e.target.value)}
                            className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-full bg-white"
                        >
                            <option value="" disabled>
                                테마 선택
                            </option>
                            {themes.map(({ id, keyword }) => (
                                <option key={id} value={id}>
                                    {keyword}
                                </option>
                            ))}
                        </select>

                        {/* 📌 장르 선택 */}
                        <select
                            value={genre}
                            onChange={e => setGenre(e.target.value)}
                            className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-full bg-white"
                        >
                            <option value="" disabled>
                                장르 선택
                            </option>
                            {genres.map(({ id, keyword }) => (
                                <option key={id} value={id}>
                                    {keyword}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 📌 참여 아동 선택 */}
                <div className="flex flex-col gap-3">
                    <select
                        onChange={e => {
                            const child = childrenOptions.find(c => c.id === parseInt(e.target.value));
                            if (child && !selectedChildren.some(c => c.id === child.id)) {
                                setSelectedChildren([...selectedChildren, child]);
                            }
                        }}
                        className="p-2 rounded-xl w-[75%] bg-white outline-none border-[2px] focus:border-[#FFBD73]"
                    >
                        <option value="">아동 선택</option>
                        {childrenOptions.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>

                    {/* 선택된 아동 목록 */}
                    <div className="flex flex-wrap gap-2 ">
                        {selectedChildren.map(({ id, name }) => (
                            <div className="flex gap-1 bg-gray-200 px-3 py-1  rounded">
                                <span key={id}>{name}</span>
                                <GiCancel
                                    className="w-4"
                                    onClick={() => deleteChild(id)}
                                    style={{ cursor: 'pointer', margin: 'auto' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* 제출 버튼 */}
                <div className="flex justify-end col-span-2">
                    <button onClick={handleSubmit} className="px-10 py-3 bg-[#FFB703] text-white font-bold rounded-lg">
                        생성하기
                    </button>
                </div>
            </div>
        </>
    );
};

export default BookForm;

