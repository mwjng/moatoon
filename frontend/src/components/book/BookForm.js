import React, { useState, useEffect } from 'react';
import { fetchKeywords } from '../../api/party';
import { GiCancel } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import AlertModal from '../../components/common/AlertModal';

const levelOptions = ['Lv1 (4~6세)', 'Lv2 (7세)', 'Lv3 (8세)', 'Lv4 (9세)', 'Lv5 (10세)', 'Lv6 (11세)'];
const episodeOptions = Array.from({ length: 9 }, (_, i) => i + 2);
const publicStatusOptions = ['공개', '비공개'];
const dayOptions = ['월', '화', '수', '목', '금', '토', '일'];

const BookForm = ({ onSubmit, selectTimeHandler, closeModal }) => {
    const [startDate, setStartDate] = useState('');
    const [level, setLevel] = useState(levelOptions[0]);
    const [episodeLength, setEpisodeLength] = useState(episodeOptions[0]);
    const [time, setTime] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [publicStatus, setPublicStatus] = useState(publicStatusOptions[0]);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const userChildren = useSelector(state => state.user.userInfo?.childrenList || []);

    const [mood, setMood] = useState('');
    const [theme, setTheme] = useState('');
    const [genre, setGenre] = useState('');
    const [difficulty, setDifficulty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [moods, setMoods] = useState([]);
    const [themes, setThemes] = useState([]);
    const [genres, setGenres] = useState([]);

    const [modalText, setModalText] = useState('모든 요소를 선택하세요.');
    const [modalState, setModalState] = useState(false);

    const handleCloseModal = () => {
        setModalState(false);
    };
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
    }, [userChildren, selectedChildren]);

    const handleChildSelect = e => {
        const selectedId = parseInt(e.target.value);
        if (!selectedId) return; // 빈 선택인 경우 처리하지 않음

        const selectedChild = userChildren.find(child => child.id === selectedId);
        console.log('Selected child:', selectedChild); // 선택된 아이 확인

        if (selectedChild && !selectedChildren.some(child => child.id === selectedChild.id)) {
            setSelectedChildren(prev => [...prev, selectedChild]);
        }
    };

    // 시간 드롭다운 옵션 생성 (09:00 ~ 22:00, 30분 단위)
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

    // 폼 제출
    const handleSubmit = async () => {
        if (
            !startDate ||
            !time ||
            !mood ||
            !theme ||
            !genre ||
            selectedChildren.length === 0 ||
            selectedDays.length === 0
        ) {
            setModalState(true);
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
            mood: {
                id: parseInt(mood),
                keyword: moods.find(m => m.id === parseInt(mood))?.keyword || '',
            },
            theme: {
                id: parseInt(theme),
                keyword: themes.find(t => t.id === parseInt(theme))?.keyword || '',
            },
            genre: {
                id: parseInt(genre),
                keyword: genres.find(g => g.id === parseInt(genre))?.keyword || '',
            },

            difficulty,
        });
    };

    const deleteChild = id => {
        setSelectedChildren(selectedChildren.filter(child => child.id != id));
    };

    return (
        <>
            <div className="grid grid-cols-[1fr 50%] gap-x-2 gap-y-6 w-full ">
                {/* 방 시작일 선택 */}
                <div className="flex items-center">
                    <label htmlFor="start" className="w-[120px]">
                        시작일
                    </label>
                    <input
                        id="start"
                        type="date"
                        min={new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="p-2 outline-none border-[2px] focus:border-[#FFBD73] rounded-xl w-[50%] bg-white"
                    />
                </div>
                {/* 시간 선택 */}
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
                {/* 에피소드 분량 선택 */}
                <div className="flex items-center">
                    <label htmlFor="length" className="w-[120px]">
                        챕터 수
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
                {/* 난이도 선택 */}
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
                {/* 요일 선택 */}
                <div className="flex items-center">
                    <label htmlFor="select-day" className="w-[120px]">
                        진행 요일
                    </label>

                    <div
                        id="select-day"
                        className="flex gap-5 justify-between w-[60%] rounded-xl p-2 pl-3 pr-3 bg-white border-[2px]"
                    >
                        {dayOptions.map(day => (
                            <label
                                key={day}
                                className="flex-col-reverse relative flex items-center cursor-pointer border-gray-300 text-sm "
                            >
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
                                    className="hidden"
                                />
                                <span
                                    className={`w-4 h-4 flex items-center justify-center rounded-lg border-2  transition-all border-[#aaa] ${
                                        selectedDays.includes(day)
                                            ? 'bg-[#FFBD73] border-[#FFBD73] text-white'
                                            : 'bg-[#eee] shadow-sm text-black'
                                    }`}
                                ></span>
                                <span>{day} </span>
                            </label>
                        ))}
                    </div>
                </div>
                {/* 공개 여부 선택 */}
                <div className="flex items-center">
                    <label htmlFor="select-open" className="w-[120px]">
                        공개 여부
                    </label>
                    <div id="select-open" className="col-span-2 flex">
                        {publicStatusOptions.map(option => {
                            const isChecked = publicStatus === option;
                            return (
                                <label key={option} className="flex items-center mr-4 cursor-pointer relative">
                                    <input
                                        type="radio"
                                        name="publicStatus"
                                        value={option}
                                        checked={isChecked}
                                        onChange={() => setPublicStatus(option)}
                                        className="hidden"
                                    />
                                    {/* 커스텀 라디오 */}
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 flex items-center justify-center ${
                                            isChecked ? 'bg-[#FFBD73] border-[#FFBD73]' : 'bg-white border-[#FFBD73]'
                                        }`}
                                    >
                                        {isChecked && <span className="w-2 h-2 rounded-full bg-white" />}
                                    </span>
                                    <span className="ml-2">{option}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center">
                    <label className="w-[120px]" htmlFor="select-keyword">
                        키워드
                    </label>
                    {/* 분위기 선택 */}
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

                        {/* 테마 선택 */}
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

                        {/* 장르 선택 */}
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

                {/* 참여 아동 선택 */}
                <div className="flex flex-col gap-3">
                    <select
                        onChange={handleChildSelect}
                        className="p-2 rounded-xl w-[75%] bg-white outline-none border-[2px] focus:border-[#FFBD73]"
                        value="" // 선택 후 기본값으로 리셋
                    >
                        <option value="">아동 선택</option>
                        {userChildren?.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>

                    {/* 선택된 아동 목록 */}
                    <div className="flex flex-wrap gap-2">
                        {selectedChildren?.map(({ id, name }) => (
                            <div key={id} className="flex gap-1 bg-gray-200 px-3 py-1 rounded">
                                <span>{name}</span>
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

            <AlertModal text={modalText} modalState={modalState} closeHandler={handleCloseModal} />
        </>
    );
};

export default BookForm;
