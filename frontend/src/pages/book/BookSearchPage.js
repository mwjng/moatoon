import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { DayPicker } from 'react-day-picker';
import axios from 'axios';
import defaultBookCover from '../../assets/images/book1.png';
import { getPartyDetail } from '../../api/party'

const BookSearchPage = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchParams, setSearchParams] = useState({
    startDate: null,
    endDate: null,
    time: '',
    dayWeek: [],
    episodeLength: '',
    level: '',
    canJoin: false
  });
  const [loading, setLoading] = useState(false);
  

  const timeOptions = generateTimeOptions();
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  const weekDayValues = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const levels = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchAllParties();
  }, []);

  const fetchAllParties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/parties?canJoin=false');
      setParties(response.data);
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (searchParams.startDate) {
        queryParams.append('startDate', formatDate(searchParams.startDate));
      }
      if (searchParams.endDate) {
        queryParams.append('endDate', formatDate(searchParams.endDate));
      }
      if (searchParams.time) {
        queryParams.append('time', searchParams.time);
      }
      if (searchParams.dayWeek.length > 0) {
        queryParams.append('dayWeek', searchParams.dayWeek.join(','));
      }
      if (searchParams.episodeLength) {
        queryParams.append('episodeLength', searchParams.episodeLength);
      }
      if (searchParams.level) {
        queryParams.append('level', searchParams.level);
      }
      queryParams.append('canJoin', searchParams.canJoin);

      const response = await axios.get(`/parties?${queryParams.toString()}`);
      setParties(response.data);
    } catch (error) {
      console.error('Error searching parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      startDate: null,
      endDate: null,
      time: '',
      dayWeek: [],
      episodeLength: '',
      level: '',
      canJoin: false
    });
    fetchAllParties();
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


  const groupPartysByLevel = () => {
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
                onChange={(e) => setSearchParams(prev => ({ ...prev, canJoin: e.target.checked }))}
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

        {/* Results Section */}
        {/* 책 상세 모달달 */}
        {showBookDetail && currentPartyId && (
                        <BookDetail 
                            partyId={currentPartyId}
                            onClose={handleBookDetailClose}
                        />
                    )}

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