// ManagerMainPage.js
import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import ManagerBookList from '../../components/main/ManagerBookList';
import { getMonthlySchedule } from '../../api/schedule';

const CalendarIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-5 h-5 text-gray-500"
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const memberColors = {
  1: 'bg-pink-100',
  2: 'bg-blue-100',
  3: 'bg-green-100',
  4: 'bg-purple-100',
  5: 'bg-yellow-100',
  6: 'bg-indigo-100',
  7: 'bg-red-100',
  8: 'bg-orange-100',
};

const memberHoverColors = {
  1: 'hover:bg-pink-200',
  2: 'hover:bg-blue-200',
  3: 'hover:bg-green-200',
  4: 'hover:bg-purple-200',
  5: 'hover:bg-yellow-200',
  6: 'hover:bg-indigo-200',
  7: 'hover:bg-red-200',
  8: 'hover:bg-orange-200',
};

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const GroupedScheduleEvent = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-white mb-1 rounded cursor-pointer
        ${isHovered ? 'shadow-md' : ''}
        transition-all duration-150 ease-in-out relative
        border border-gray-400
      `}
    >
      {/* 왼쪽 컬러바 표시 (한 명일 때) */}
      {event?.participants?.length === 1 && (
        <div 
          className={`absolute left-0 top-0 bottom-0 w-1 ${memberColors[event.participants[0].id]}`}
        />
      )}

      {/* 다중 참여자인 경우 왼쪽에 컬러 바 표시 */}
      {event?.participants?.length > 1 && (
        <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col">
          {event.participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex-1 ${memberColors[participant.id]}`}
            />
          ))}
        </div>
      )}
      
      <div className="flex flex-col px-2 py-1">
        <span className="text-xs font-medium truncate">{event.title}</span>
        <span className="text-gray-500 text-xs">{event.time}</span>
        
        {/* 클릭 시 참여자 정보 표시 */}
        {isExpanded && (
          <div className="mt-1 pt-1 border-t border-gray-300">
            <span className="text-xs text-gray-500 block mb-1">참여 아동:</span>
            <div className="flex flex-wrap gap-1">
              {event.participants?.map((participant) => (
                <div
                  key={participant.id}
                  className={`text-xs px-1.5 py-0.5 rounded ${memberColors[participant.id]} border border-gray-300`}
                >
                  {participant.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SingleScheduleEvent = ({ schedule, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${color} px-2 py-1 mb-1 rounded cursor-pointer
        border border-gray-400
        ${isHovered ? 'shadow-md' : ''}
        transition-all duration-150 ease-in-out
      `}
    >
      <div className="flex flex-col">
        <span className="text-xs font-medium truncate">{schedule.title}</span>
        <span className="text-gray-600 text-xs">{schedule.time}</span>
      </div>
    </div>
  );
};

const DayCell = ({ day, isToday, dayIndex, selectedMember, formatTime }) => {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const maxVisibleEvents = 2;
  const hasMoreEvents = day.events.length > maxVisibleEvents;
  
  const visibleEvents = showAllEvents ? day.events : day.events.slice(0, maxVisibleEvents);
  
  return (
    <div
      className={`min-h-16 p-1.5 border-b border-r relative
        ${!day.isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''}
        ${dayIndex === 0 && day.isCurrentMonth ? 'text-red-500' : ''}
        ${isToday ? 'bg-blue-50' : ''}
      `}
    >
      <div className={`text-xs mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
        {day.date.getDate()}
      </div>
      <div className="space-y-1">
        {visibleEvents.map((event) => (
          selectedMember === 'all' ? (
            <GroupedScheduleEvent
              key={event.id}
              event={event}
            />
          ) : (
            <SingleScheduleEvent
              key={event.id}
              schedule={{
                title: event.title,
                time: formatTime(event.sessionTime)
              }}
              color={memberColors[event.memberId]}
            />
          )
        ))}
        
        {hasMoreEvents && (
          <button
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1"
          >
            {showAllEvents ? (
              <>
                <span>접기</span>
                <svg className="w-3 h-3" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 15l7-7 7 7"></path>
                </svg>
              </>
            ) : (
              <>
                <span>+{day.events.length - maxVisibleEvents}개 더보기</span>
                <svg className="w-3 h-3" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const ManagerMainPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState('all');
  const [calendarData, setCalendarData] = useState([]);

  const getSchedule = async () => {
    setIsLoading(true);
    try {
      const res = await getMonthlySchedule(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      
      if (!res || res.status !== 200) {
        throw new Error('Failed to fetch schedule data');
      }
      
      setError(null);
      setScheduleData(res.data);
    } catch (err) {
      setError('스케줄 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSchedule();
  }, [currentDate]);

  useEffect(() => {
    setCalendarData(generateCalendar());
  }, [selectedMember, scheduleData]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMonthYear = (date) => (
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
  );

  const isSameDay = (date1, date2) => (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );

  const generateCalendar = () => {
    if (!scheduleData) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayIndex = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const weeks = [];
    let days = [];

    // 이전 달의 날짜들
    for (let i = 0; i < startingDayIndex; i++) {
      days.push({
        date: new Date(year, month, -startingDayIndex + i + 1),
        isCurrentMonth: false,
        events: []
      });
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      let events = [];

      if (selectedMember === 'all') {
        // 전체보기: 일정 그룹화
        const dayEventsMap = new Map();
        
        if (scheduleData?.childrenSchedules) {
          scheduleData.childrenSchedules.forEach(member => {
            member.schedules.forEach(schedule => {
              const scheduleDate = new Date(schedule.sessionTime);
              if (isSameDay(date, scheduleDate)) {
                const eventKey = `${schedule.sessionTime}-${schedule.bookTitle}`;
                
                if (!dayEventsMap.has(eventKey)) {
                  dayEventsMap.set(eventKey, {
                    id: eventKey,
                    title: schedule.bookTitle,
                    time: formatTime(schedule.sessionTime),
                    participants: [{
                      id: member.memberId,
                      name: member.name
                    }]
                  });
                } else {
                  const event = dayEventsMap.get(eventKey);
                  if (!event.participants.some(p => p.id === member.memberId)) {
                    event.participants.push({
                      id: member.memberId,
                      name: member.name
                    });
                  }
                }
              }
            });
          });
        }

        events = Array.from(dayEventsMap.values());
      } else {
        // 개별 보기: 선택된 아동의 일정만 표시
        const selectedChild = scheduleData?.childrenSchedules?.find(
          member => member.memberId.toString() === selectedMember.toString()
        );

        if (selectedChild) {
          events = selectedChild.schedules
            .filter(schedule => isSameDay(date, new Date(schedule.sessionTime)))
            .map(schedule => ({
              id: schedule.scheduleId,
              title: schedule.bookTitle,
              sessionTime: schedule.sessionTime,
              memberId: selectedChild.memberId
            }));
        }
      }

      days.push({ date, isCurrentMonth: true, events });

      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }
    }

    // 다음 달의 날짜들
    if (days.length > 0) {
      const remainingDays = 7 - days.length;
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          date: new Date(year, month + 1, day),
          isCurrentMonth: false,
          events: []
        });
      }
      weeks.push(days);
    }

    return weeks;
  };

  return (
    <div className="min-h-screen bg-blue1 flex flex-col">
      <Navigation />
      <div className="h-3/5">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex gap-4">
            <div className="flex-1 bg-white px-4 rounded-lg shadow">
              {/* Calendar Header */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <h2 className="text-xl font-medium">{formatMonthYear(currentDate)}</h2>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                      className="w-6 h-6 flex items-center justify-center border rounded text-gray-500 text-sm hover:bg-gray-100"
                    >
                      ＜
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                      className="w-6 h-6 flex items-center justify-center border rounded text-gray-500 text-sm hover:bg-gray-100"
                    >
                      ＞
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date())}
                      className="px-2 h-6 flex items-center justify-center border rounded text-gray-500 text-sm hover:bg-gray-100"
                    >
                      오늘
                    </button>
                  </div>
                </div>
                {scheduleData && (
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="all">전체 보기</option>
                    {scheduleData.childrenSchedules.map(member => (
                      <option key={member.memberId} value={member.memberId.toString()}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Calendar Body */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">데이터를 불러오는 중...</div>
                </div>
              ) : error ? (
                <div className="text-red-500 p-4">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-7">
                    {weekDays.map((day, index) => (
                      <div key={day} className={`text-xs text-center py-1.5 ${index === 0 ? 'text-red-500' : ''}`}>
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="border-t">
                  {calendarData.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7">
                      {week.map((day, dayIndex) => (
                        <DayCell
                          key={dayIndex}
                          day={day}
                          isToday={isSameDay(day.date, new Date())}
                          dayIndex={dayIndex}
                          selectedMember={selectedMember}
                          formatTime={formatTime}  // 이 부분이 추가됨
                        />
                      ))}
                    </div>
                  ))}
                  </div>
                </>
              )}
            </div>

            {/* Member List Sidebar */}
            <div className="bg-white rounded-lg shadow p-3 h-fit">
              <h3 className="font-medium mb-2 text-sm">아동 목록</h3>
              {scheduleData && (
                <div className="space-y-1.5">
                  {scheduleData.childrenSchedules.map(member => (
                    <div
                      key={member.memberId}
                      onClick={() => setSelectedMember(
                        selectedMember === member.memberId.toString() ? 'all' : member.memberId.toString()
                      )}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors duration-200
                        ${selectedMember === member.memberId.toString() ? `${memberColors[member.memberId]} bg-opacity-50` : ''}
                        ${memberHoverColors[member.memberId]}
                      `}
                    >
                      <div className={`w-3 h-3 rounded ${memberColors[member.memberId]}`}></div>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-2/5 bg-light-blue1 flex items-center justify-center">
        <ManagerBookList/>
      </div>
    </div>
  );
};

export default ManagerMainPage;