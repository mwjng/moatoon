import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { DayPicker } from 'react-day-picker';
import defaultBookCover from '../../assets/images/book1.png';
import { fetchAllParties } from '../../api/party'

const BookSearchPage = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPartyId, setCurrentPartyId] = useState(null);

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
  }, [filter]);  // ✅ filter가 변경될 때만 실행
  

  const loadParties = async () => {
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

    // 📌 특정 책 클릭 시 상세 보기 모달 열기
  const openBookDetail = (partyId) => {
    setCurrentPartyId(partyId);
    setShowBookDetail(true);
  };

  // 📌 모달 닫기
  const closeBookDetail = () => {
    setShowBookDetail(false);
    setCurrentPartyId(null);
  };

  // const handleSearch = async () => {
  //   try {
  //     setLoading(true);
      
  //     if (searchParams.startDate) {
  //       setFilter(prev => ({...prev, startDate:formatDate(searchParams.startDate)}))
  //     }
  //     if (searchParams.endDate) {
  //       setFilter(prev => ({...prev, endDate:formatDate(searchParams.endDate)}))
  //     }
  //     if (searchParams.time) {
  //       setFilter(prev => ({...prev, time:formatDate(searchParams.time)}))
  //     }
  //     if (searchParams.dayWeek.length > 0) {
  //       setFilter(prev => ({...prev, dayWeek:formatDate(searchParams.dayWeek.join(','))}))
  //     }
  //     if (searchParams.episodeLength) {
  //       setFilter(prev => ({...prev, episodeLength:formatDate(searchParams.episodeLengthe)}))
  //     }
  //     if (searchParams.level) {
  //       setFilter(prev => ({...prev, level:formatDate(searchParams.level)}))
  //     }

  //     const response = fetchAllParties(filter)
  //     setParties(response.data);
  //   } catch (error) {
  //     console.error('Error searching parties:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



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
    if (range) {
      setSearchParams(prev => ({
        ...prev,
        startDate: range.from,
        endDate: range.to
      }));
    }
    setShowCalendar(false);
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

  const navigateToBookDetail = (partyId) => {
    navigate(`/book/${partyId}`);
  };

  const groupPartysByLevel = () => {
    if (!parties || !Array.isArray(parties)) return {}; // ✅ parties가 없거나 배열이 아닐 경우 빈 객체 반환
  
    const grouped = {};
    levels.forEach(level => {
      grouped[level] = parties.filter(party => party.level === level);
    });
    return grouped;
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Date Selection */}
            <div className="relative">
              <button
                className="btn btn-sm bg-white text-gray-700 border-gray-200"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {searchParams.startDate ? formatDate(searchParams.startDate) : '시작일'}
              </button>
              {showCalendar && (
                <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg">
                  <DayPicker
                    mode="range"
                    selected={{
                      from: searchParams.startDate,
                      to: searchParams.endDate
                    }}
                    onSelect={handleDaySelect}
                    disabled={{ before: new Date() }}
                  />
                </div>
              )}
            </div>

            {/* Time Selection */}
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

            {/* Day Selection */}
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

            {/* Episode Length */}
            <input
              type="number"
              placeholder="에피소드 수"
              className="input input-sm input-bordered"
              value={searchParams.episodeLength}
              onChange={(e) => setSearchParams(prev => ({ ...prev, episodeLength: e.target.value }))}
            />

            {/* Level Selection */}
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

            {/* Available Spots */}
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

            {/* Search and Reset Buttons */}
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
        </div>

        {showBookDetail && currentPartyId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-3xl relative">
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowBookDetail(false)}
              >
                ✕
              </button>
              <BookDetail partyId={currentPartyId} />
            </div>
          </div>
        )}

        {/* Results Section */}
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupPartysByLevel()).map(([level, levelParties]) => (
              <div
                key={level}
                className={`p-6 rounded-lg ${
                  Number(level) % 2 === 1 ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <h2 className="text-xl font-bold mb-4">Level {level}</h2>
                {levelParties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {levelParties.map(party => (
                      <div
                        key={party.partyId}
                        className="cursor-pointer transition-transform hover:scale-105"
                        onClick={() => navigateToBookDetail(party.partyId)}
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

            {parties.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        )}
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