import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import defaultBookCover from '../../assets/images/book1.png';
import { fetchAllParties, getPartyDetailByPin } from '../../api/party';
import BookDetail from '../../components/book/BookDetail';
import Alert from '../../components/common/AlertModal';
import Loading from '../../components/Loading';

const BookSearchPage = () => {
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBookDetail, setShowBookDetail] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentPartyId, setCurrentPartyId] = useState(0);
    const [modalLoading, setModalLoading] = useState(false);
    const [alertModalState, setAlertModalState] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [pin, setPin] = useState('');

    const [currentDate, setCurrentDate] = useState(new Date());

    function getDateForIndex(index, currentDate) {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startingDay = firstDayOfMonth.getDay();

        if (index < startingDay) return null;

        const date = new Date(firstDayOfMonth);
        date.setDate(index - startingDay + 1);

        if (date.getMonth() !== currentDate.getMonth()) return null;

        return date;
    }

    const handleDateSelect = date => {
        if (!searchParams.startDate || (searchParams.startDate && searchParams.endDate)) {
            setSearchParams(prev => ({
                ...prev,
                startDate: date,
                endDate: null,
            }));
        } else {
            if (date < searchParams.startDate) {
                setSearchParams(prev => ({
                    ...prev,
                    startDate: date,
                    endDate: prev.startDate,
                }));
            } else {
                setSearchParams(prev => ({
                    ...prev,
                    endDate: date,
                }));
            }
            setShowCalendar(false);
        }
    };

    const [searchParams, setSearchParams] = useState({
        startDate: null,
        endDate: null,
        time: '',
        dayWeek: [],
        episodeLength: '',
        level: '',
        canJoin: false,
    });

    const isFiltering = () => {
        return (
            searchParams.startDate !== null ||
            searchParams.endDate !== null ||
            searchParams.time !== '' ||
            searchParams.dayWeek.length > 0 ||
            searchParams.episodeLength !== '' ||
            searchParams.level !== '' ||
            searchParams.canJoin === true
        );
    };

    const timeOptions = generateTimeOptions();
    const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
    const weekDayValues = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const levels = [1, 2, 3, 4, 5, 6];
    const [filter, setFilter] = useState({ canJoin: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchAllParties(filter);
                setParties(data);
            } catch (error) {
                console.error('방 목록 가져오기 실패', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter]);

    // Alert 모달 닫기 핸들러
    const closeAlertModal = () => {
        setAlertModalState(false);
    };

    const handleSearch = async () => {
        const updatedFilter = {
            ...filter,
            startDate: searchParams.startDate ? formatDate(searchParams.startDate) : undefined,
            endDate: searchParams.endDate ? formatDate(searchParams.endDate) : undefined,
            time: searchParams.time || undefined,
            dayWeek: searchParams.dayWeek.length > 0 ? searchParams.dayWeek.join(',') : undefined,
            episodeLength: searchParams.episodeLength || undefined,
            level: searchParams.level || undefined,
        };

        setFilter(updatedFilter);
    };

    const handleReset = () => {
        // searchParams 초기화
        setSearchParams({
            startDate: null,
            endDate: null,
            time: '',
            dayWeek: [],
            episodeLength: '',
            level: '',
            canJoin: false,
        });

        // filter 상태도 초기화
        setFilter({ canJoin: false });
    };

    const handleWeekDayToggle = dayIndex => {
        const dayValue = weekDayValues[dayIndex];
        setSearchParams(prev => ({
            ...prev,
            dayWeek: prev.dayWeek.includes(dayValue)
                ? prev.dayWeek.filter(d => d !== dayValue)
                : [...prev.dayWeek, dayValue],
        }));
    };
    const handleCardClick = async partyId => {
        if (!partyId || typeof partyId !== 'number') {
            return;
        }
        await setCurrentPartyId(partyId);
        setShowBookDetail(true);
    };

    const handleCloseModal = () => {
        setShowBookDetail(false);
        setCurrentPartyId(null);
    };

    // 핀 번호 제출 핸들러 수정
    const handlePinSubmit = async e => {
        e.preventDefault();
        if (!pin.trim()) {
            setAlertMessage('PIN 번호를 입력해주세요.');
            setAlertModalState(true);
            return;
        }

        try {
            const data = await getPartyDetailByPin(pin);

            if (!data || data.length === 0) {
                setAlertMessage('해당 PIN 번호의 방을 찾을 수 없습니다.');
                setAlertModalState(true);
                return;
            }

            setCurrentPartyId(pin);
            setShowBookDetail(true);
            setPin(''); // 검색 후 입력 필드 초기화
        } catch (error) {
            setAlertMessage('검색 결과가 없습니다.');
            setAlertModalState(true);
        }
    };

    const groupPartysByLevel = () => {
        if (!parties || !Array.isArray(parties)) return {};

        // 먼저 레벨별로 파티들을 그룹화
        const grouped = {};
        levels.forEach(level => {
            grouped[level] = parties.filter(party => party.level === level);
        });

        // 파티 수를 기준으로 레벨들을 정렬
        const sortedLevels = Object.entries(grouped)
            .sort(([, partiesA], [, partiesB]) => partiesB.length - partiesA.length)
            .reduce((acc, [level, parties]) => {
                acc[level] = parties;
                return acc;
            }, {});

        return sortedLevels;
    };

    const levelAgeMap = {
        1: '4~6세',
        2: '7세',
        3: '8세',
        4: '9세',
        5: '10세',
        6: '11세',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <style>
                {`
                .no-spinner {
                    -moz-appearance: textfield;
                }
                .no-spinner::-webkit-outer-spin-button,
                .no-spinner::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}
            </style>

            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-center flex-wrap gap-4">
                        {/* Date Selection */}
                        <div className="relative">
                            <button
                                className="btn btn-sm bg-white border-none hover:bg-gray-100"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                {searchParams.startDate ? formatDate(searchParams.startDate) : 'From'} -{' '}
                                {searchParams.endDate ? formatDate(searchParams.endDate) : 'To'}
                            </button>

                            {showCalendar && (
                                <div className="absolute z-50 mt-2">
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                                        <div className="w-72">
                                            {/* Calendar Header */}
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded-full"
                                                        onClick={() => {
                                                            const newDate = new Date(currentDate);
                                                            newDate.setMonth(newDate.getMonth() - 1);
                                                            setCurrentDate(newDate);
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 19l-7-7 7-7"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <span className="text-sm font-medium">
                                                        {currentDate.toLocaleDateString('ko-KR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                        })}
                                                    </span>
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded-full"
                                                        onClick={() => {
                                                            const newDate = new Date(currentDate);
                                                            newDate.setMonth(newDate.getMonth() + 1);
                                                            setCurrentDate(newDate);
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Calendar Grid */}
                                            <div className="p-4">
                                                <div className="grid grid-cols-7 gap-0">
                                                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                                                        <div
                                                            key={day}
                                                            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                                                        >
                                                            {day}
                                                        </div>
                                                    ))}

                                                    {Array.from({ length: 42 }).map((_, index) => {
                                                        const date = getDateForIndex(index, currentDate);
                                                        const isPastDate =
                                                            date && date < new Date(new Date().setHours(0, 0, 0, 0));
                                                        const isSelected =
                                                            date &&
                                                            ((searchParams.startDate &&
                                                                date.getTime() === searchParams.startDate.getTime()) ||
                                                                (searchParams.endDate &&
                                                                    date.getTime() === searchParams.endDate.getTime()));
                                                        const isInRange =
                                                            date &&
                                                            searchParams.startDate &&
                                                            searchParams.endDate &&
                                                            date >= searchParams.startDate &&
                                                            date <= searchParams.endDate;

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="h-8 w-8 flex items-center justify-center p-0"
                                                            >
                                                                {date && (
                                                                    <button
                                                                        className={`
                                      w-7 h-7 flex items-center justify-center text-sm rounded-full
                                      ${isPastDate ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                                      ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                                      ${isInRange && !isSelected ? 'bg-blue-50 text-blue-600' : ''}
                                    `}
                                                                        disabled={isPastDate}
                                                                        onClick={() => handleDateSelect(date)}
                                                                    >
                                                                        {date.getDate()}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <select
                            className="select select-sm select-bordered bg-white border-none shadow-sm"
                            value={searchParams.time}
                            onChange={e => setSearchParams(prev => ({ ...prev, time: e.target.value }))}
                        >
                            <option value="">시간 선택</option>
                            {timeOptions.map(time => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-1">
                            {weekDays.map((day, index) => (
                                <button
                                    key={day}
                                    className={`btn btn-sm border-none ${
                                        searchParams.dayWeek.includes(weekDayValues[index])
                                            ? 'bg-blue-500 border-none text-white hover:bg-blue-200'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-200'
                                    }`}
                                    onClick={() => handleWeekDayToggle(index)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        {/*  */}

                        <div className="flex items-center">
                            {/* 감소 버튼 */}
                            <button
                                onClick={() =>
                                    setSearchParams(prev => ({
                                        ...prev,
                                        episodeLength: prev.episodeLength
                                            ? Math.max(1, Number(prev.episodeLength) - 1)
                                            : 1,
                                    }))
                                }
                                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 border-none"
                            >
                                -
                            </button>

                            {/* 챕터 수 입력란 */}
                            <input
                                type="number"
                                placeholder="챕터"
                                min={1}
                                value={searchParams.episodeLength || ''}
                                readOnly
                                className="input input-sm input-bordered bg-white text-center mx-2 w-16 no-spinner text-sm"
                            />

                            {/* 증가 버튼 */}
                            <button
                                onClick={() =>
                                    setSearchParams(prev => ({
                                        ...prev,
                                        episodeLength: prev.episodeLength ? Number(prev.episodeLength) + 1 : 1,
                                    }))
                                }
                                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 border-none"
                            >
                                +
                            </button>
                        </div>

                        <select
                            className="select select-sm select-bordered bg-white border-none  shadow-sm"
                            value={searchParams.level}
                            onChange={e => setSearchParams(prev => ({ ...prev, level: e.target.value }))}
                        >
                            <option value="">난이도 선택</option>
                            {levels.map(level => (
                                <option key={level} value={level}>
                                    Level {level}
                                </option>
                            ))}
                        </select>

                        <label className="cursor-pointer flex items-center gap-2 bg-white border-none">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm border-2 border-gray-300"
                                checked={searchParams.canJoin}
                                onChange={e => {
                                    setSearchParams(prev => ({ ...prev, canJoin: e.target.checked }));
                                    setFilter(prev => ({ ...prev, canJoin: e.target.checked }));
                                }}
                            />
                            <span className="text-sm">빈자리만 보기</span>
                        </label>

                        <div className="flex gap-2">
                            <button
                                className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 border-none"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                검색
                            </button>
                            <button
                                className="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
                                onClick={handleReset}
                            >
                                초기화
                            </button>
                        </div>
                    </div>

                    {/* 핀 번호 검색 추가 */}
                    <div className="flex justify-center mb-1 mt-8">
                        <label className="input input-bordered input-sm w-96 flex items-center gap-2 border-2 border-gray-300 rounded-lg bg-white border-none  shadow-sm">
                            <input
                                type="text"
                                className="grow bg-white border-none"
                                placeholder="Pin 번호를 입력하세요"
                                value={pin}
                                onChange={e => setPin(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handlePinSubmit(e);
                                    }
                                }}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70"
                                onClick={handlePinSubmit}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>
                    </div>
                </div>

                {/* 기존의 렌더링 부분 */}
                {parties.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-500">검색 결과가 없습니다</p>
                    </div>
                ) : loading ? (
                    <Loading />
                ) : isFiltering() ? (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">검색 결과 ({parties.length}개의 파티)</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {parties.map(party => (
                                <div
                                    key={party.partyId}
                                    className="cursor-pointer transition-transform hover:scale-105"
                                    onClick={() => handleCardClick(party.partyId)}
                                >
                                    <img
                                        src={party.bookCover || defaultBookCover}
                                        alt={party.bookTitle}
                                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                                        onError={e => {
                                            e.target.src = defaultBookCover;
                                        }}
                                    />
                                    <h3 className="mt-2 font-medium text-sm">{party.bookTitle}</h3>
                                    <p className="text-sm text-gray-600">참여자: {party.participantCount}명</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupPartysByLevel())
                            .sort(([, partiesA], [, partiesB]) => partiesB.length - partiesA.length)
                            .map(([level, levelParties], index) => (
                                <div
                                    key={level}
                                    className={`p-6 rounded-lg ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}
                                >
                                    <h2 className="text-xl font-bold mb-4">
                                        Level {level} ({levelAgeMap[level]}) - {levelParties.length}개의 도서
                                    </h2>
                                    {levelParties.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {levelParties.map(party => (
                                                <div
                                                    key={party.partyId}
                                                    className="cursor-pointer transition-transform hover:scale-105"
                                                    onClick={() => handleCardClick(party.partyId)}
                                                >
                                                    <img
                                                        src={party.bookCover || defaultBookCover}
                                                        alt={party.bookTitle}
                                                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                                                        onError={e => {
                                                            e.target.src = defaultBookCover;
                                                        }}
                                                    />
                                                    <h3 className="mt-2 font-medium text-sm">{party.bookTitle}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        참여자: {party.participantCount}명
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            해당 난이도는 아직 책 정보가 없어요
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {showBookDetail && currentPartyId && (
                    <div className="fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div
                                className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="max-h-[90vh] overflow-hidden rounded-xl">
                                    <BookDetail
                                        partyIdOrPin={currentPartyId}
                                        onClose={handleCloseModal}
                                        setModalLoading={setModalLoading}
                                    />
                                </div>
                            </div>
                        </div>
                        {modalLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                            </div>
                        )}
                    </div>
                )}

                <Alert modalState={alertModalState} text={alertMessage} closeHandler={closeAlertModal} />
            </div>
        </div>
    );
};

function generateTimeOptions() {
    const times = [];
    for (let hour = 9; hour <= 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push(timeString);
        }
    }
    return times;
}

function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export default BookSearchPage;
