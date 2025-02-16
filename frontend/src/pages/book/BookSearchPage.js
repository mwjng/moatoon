import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { DayPicker } from 'react-day-picker';
import defaultBookCover from '../../assets/images/book1.png';
import { fetchAllParties , getPartyDetailByPin } from '../../api/party'
import BookDetail from '../../components/book/BookDetail';
import Alert from "../../components/common/AlertModal"; 

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

  const [searchParams, setSearchParams] = useState({
    startDate: null,
    endDate: null,
    time: '',
    dayWeek: [],
    episodeLength: '',
    level: '',
    canJoin: false
  });

  const timeOptions = generateTimeOptions();
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  const weekDayValues = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const levels = [1, 2, 3, 4, 5];
  const [filter, setFilter] = useState({canJoin:false});
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllParties(filter);
        setParties(data);
      } catch (error) {
        console.error("방 목록 가져오기 실패", error);
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
      level: searchParams.level || undefined
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
      canJoin: false
    });
    
    // filter 상태도 초기화
    setFilter({ canJoin: false });
  };

  const handleDaySelect = (range) => {
    const { from, to } = range;
  
    // 시작일 선택 로직
    if (from) {
      // 기존 시작일보다 이전 날짜 선택 시 새로운 시작일로 변경
      setSearchParams(prev => ({
        ...prev, 
        startDate: from
      }));
    }
  
    // 종료일 선택 로직
    if (from && to) {
      // 종료일이 시작일 이전인 경우 시작일과 종료일 교환
      const newStartDate = from <= to ? from : to;
      const newEndDate = from <= to ? to : from;
  
      setSearchParams(prev => ({
        ...prev,
        startDate: newStartDate,
        endDate: newEndDate
      }));
  
      // 캘린더 닫기
      setShowCalendar(false);
    }
  };
  


  const handleWeekDayToggle = (dayIndex) => {
    const dayValue = weekDayValues[dayIndex];
    setSearchParams(prev => ({
      ...prev,
      dayWeek: prev.dayWeek.includes(dayValue)
        ? prev.dayWeek.filter(d => d !== dayValue)
        : [...prev.dayWeek, dayValue]
    }));
  };
  const handleCardClick = async(partyId) => {
    if (!partyId || typeof partyId !== "number") {
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
 const handlePinSubmit = async (e) => {
  e.preventDefault();
  if (!pin.trim()) {
    setAlertMessage("PIN 번호를 입력해주세요.");
    setAlertModalState(true);
    return;
  }

  try {
    const data = await getPartyDetailByPin(pin);
    
    if (!data || data.length === 0) {
      setAlertMessage("해당 PIN 번호의 방을 찾을 수 없습니다.");
      setAlertModalState(true);
      return;
    }
    
    setCurrentPartyId(pin);
    setShowBookDetail(true);
    setPin(''); // 검색 후 입력 필드 초기화
  } catch (error) {
    setAlertMessage("검색 결과가 없습니다.");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-center flex-wrap gap-4">




            {/* Date Selection */}
            {/* Date Selection */}
{/* Date Selection */}
<div className="relative">
  <button
    className="btn btn-sm normal-case"
    onClick={() => setShowCalendar(!showCalendar)}
  >
    {searchParams.startDate ? formatDate(searchParams.startDate) : '시작일'} - 
    {searchParams.endDate ? formatDate(searchParams.endDate) : '종료일'}
  </button>
  
  {showCalendar && (
    <div className="absolute z-50 mt-2">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4">
        <DayPicker
  mode="range"
  selected={{
    from: searchParams.startDate,
    to: searchParams.endDate
  }}
  onSelect={handleDaySelect}
  disabled={{ 
    before: new Date() // 오늘 이전 날짜 선택 제한
  }}
  modifiersStyles={{
    selected: { 
      backgroundColor: 'rgb(59 130 246)', 
      color: 'white' 
    },
    range_middle: { 
      backgroundColor: 'rgb(219 234 254)', 
      color: 'rgb(37 99 235)' 
    },
    range_start: { 
      backgroundColor: 'rgb(59 130 246)', 
      color: 'white' 
    },
    range_end: { 
      backgroundColor: 'rgb(59 130 246)', 
      color: 'white' 
    }
  }}
/>
        </div>
      </div>
    </div>
  )}
</div>


            <select
              className="select select-sm select-bordered"
              value={searchParams.time}
              onChange={(e) => setSearchParams(prev => ({ ...prev, time: e.target.value }))}
            >
              <option value="">시간 선택</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>

            <div className="flex gap-1">
              {weekDays.map((day, index) => (
                <button
                  key={day}
                  className={`btn btn-sm ${
                    searchParams.dayWeek.includes(weekDayValues[index])
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                  onClick={() => handleWeekDayToggle(index)}
                >
                  {day}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="에피소드 수"
              className="input input-sm input-bordered"
              value={searchParams.episodeLength}
              onChange={(e) => setSearchParams(prev => ({ ...prev, episodeLength: e.target.value }))}
            />

            <select
              className="select select-sm select-bordered"
              value={searchParams.level}
              onChange={(e) => setSearchParams(prev => ({ ...prev, level: e.target.value }))}
            >
              <option value="">난이도 선택</option>
              {levels.map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>

            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={searchParams.canJoin}
                onChange={(e) => {
                  setSearchParams(prev => ({ ...prev, canJoin: e.target.checked }))
                  setFilter(prev=>({...prev, canJoin:e.target.checked}))
                }}
              />
              <span className="text-sm">빈자리만 보기</span>
            </label>

            <div className="flex gap-2">
              <button
                className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSearch}
                disabled={loading}
              >
                검색
              </button>
              <button
                className="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={handleReset}
              >
                초기화
              </button>
            </div>
          </div>

          {/* 핀 번호 검색 추가 */}
          <div className="flex justify-center mb-1 mt-8">
            <label className="input input-bordered input-sm w-96 flex items-center gap-2 border-2 border-gray-300 rounded-lg">
              <input
                type="text"
                className="grow"
                placeholder="Pin 번호를 입력하세요"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => {
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

        {parties.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupPartysByLevel())
              .sort(([, partiesA], [, partiesB]) => partiesB.length - partiesA.length)
              .map(([level, levelParties]) => (
                <div
                  key={level}
                  className={`p-6 rounded-lg ${
                    Number(level) % 2 === 1 ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <h2 className="text-xl font-bold mb-4">
                    Level {level} ({levelParties.length}개의 파티)
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
                            onError={(e) => {
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
                      onClick={(e) => e.stopPropagation()}
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


            <Alert 
              modalState={alertModalState}
              text={alertMessage}
              closeHandler={closeAlertModal}
            />
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
  return date.toISOString().split('T')[0];
}

export default BookSearchPage;