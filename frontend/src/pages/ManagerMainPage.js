import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import ManagerBookList from '../components/main/ManagerBookList'

const CalendarIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="w-5 h-5 text-gray-500"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ManagerMainPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState('all');
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [calendarData, setCalendarData] = useState([]);

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

  const sampleData = {
    month: 2,
    memberScheduleList: [
      {
        memberId: 1,
        name: "김싸피",
        scheduleList: [
          {
            scheduleId: 1,
            bookTitle: "동그라미의 모험",
            sessionTime: "2025-02-01 18:30:00"
          },
          {
            scheduleId: 2,
            bookTitle: "동그라미의 모험",
            sessionTime: "2025-02-04 18:30:00"
          }
        ]
      },
      {
        memberId: 2,
        name: "이싸피",
        scheduleList: [
          {
            scheduleId: 3,
            bookTitle: "네모의 모험",
            sessionTime: "2025-02-02 18:00:00"
          },
          {
            scheduleId: 4,
            bookTitle: "동그라미의 모험",
            sessionTime: "2025-02-04 18:00:00"
          }
        ]
      },
      {
        memberId: 3,
        name: "최싸피",
        scheduleList: []
      }
    ]
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startingDayIndex = firstDay.getDay();
    
    const totalDays = lastDay.getDate();
    const weeks = [];
    let days = [];

    for (let i = 0; i < startingDayIndex; i++) {
      days.push({
        date: new Date(year, month, -startingDayIndex + i + 1),
        isCurrentMonth: false,
        events: []
      });
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const events = [];

      sampleData.memberScheduleList.forEach(member => {
        if (selectedMember === 'all' || selectedMember === member.memberId.toString()) {
          member.scheduleList.forEach(schedule => {
            const scheduleDate = new Date(schedule.sessionTime);
            if (isSameDay(date, scheduleDate)) {
              events.push({
                id: schedule.scheduleId,
                title: `${schedule.bookTitle} (${formatTime(schedule.sessionTime)})`,
                color: memberColors[member.memberId],
                memberId: member.memberId
              });
            }
          });
        }
      });

      days.push({
        date,
        isCurrentMonth: true,
        events
      });

      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }
    }

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

  // selectedMember나 currentDate가 변경될 때마다 캘린더 데이터 업데이트
  useEffect(() => {
    const newCalendarData = generateCalendar();
    setCalendarData(newCalendarData);
  }, [selectedMember, currentDate]);

  const handleFilterChange = (e) => {
    setSelectedMember(e.target.value);
  };

  const handleMemberClick = (memberId) => {
    setSelectedMember(selectedMember === memberId.toString() ? 'all' : memberId.toString());
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date) => {
    return date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0');
  };

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();

  return (
    <div className="min-h-screen bg-blue1 flex flex-col">
        <Navigation />
        <div className="h-3/5">
          <div className="max-w-5xl mx-auto p-6">
            <div className="flex gap-4">
              <div className="flex-1 bg-white px-4 rounded-lg shadow">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <h2 className="text-xl font-medium">
                        {formatMonthYear(currentDate)}
                      </h2>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={goToPreviousMonth} className="w-6 h-6 flex items-center justify-center border rounded text-gray-500 text-sm hover:bg-gray-100">
                        ＜
                      </button>
                      <button onClick={goToNextMonth} className="w-6 h-6 flex items-center justify-center border rounded text-gray-500 text-sm hover:bg-gray-100">
                        ＞
                      </button>
                      <button onClick={goToToday} className="px-2 h-6 flex items-center justify-center border rounded text-gray-500 text-sm hover:bg-gray-100">
                        오늘
                      </button>
                    </div>
                  </div>
                  <select
                    value={selectedMember}
                    onChange={handleFilterChange}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="all">전체 보기</option>
                    {sampleData.memberScheduleList.map(member => (
                      <option key={member.memberId} value={member.memberId}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-7">
                  {weekDays.map((day, index) => (
                    <div
                      key={day}
                      className={`text-xs text-center py-1.5 ${index === 0 ? 'text-red-500' : ''}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="border-t">
                  {calendarData.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7">
                      {week.map((day, dayIndex) => {
                        const isToday = isSameDay(day.date, today);
                        const dayNumber = day.date.getDate();
                        
                        return (
                          <div
                            key={dayIndex}
                            className={`min-h-16 p-1.5 border-b border-r relative
                              ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                              ${dayIndex === 0 && day.isCurrentMonth ? 'text-red-500' : ''}
                              ${isToday ? 'bg-blue-50' : ''}
                            `}
                          >
                            <div className={`text-xs mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                              {dayNumber}
                            </div>
                            <div className="space-y-1">
                              {day.events.map((event) => (
                                <div
                                  key={event.id}
                                  onMouseEnter={() => setHoveredEvent(event.id)}
                                  onMouseLeave={() => setHoveredEvent(null)}
                                  className={`${event.color} px-1.5 py-0.5 text-xs rounded text-gray-900 cursor-pointer
                                    transition-all duration-200 ease-in-out
                                    ${hoveredEvent === event.id ? 'transform scale-105 shadow-lg bg-opacity-90' : ''}
                                    hover:shadow-md hover:translate-y-px`}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-3 h-fit">
                <h3 className="font-medium mb-2 text-sm">아동 목록</h3>
                <div className="space-y-1.5">
                  {sampleData.memberScheduleList.map(member => (
                    <div
                      key={member.memberId}
                      onClick={() => handleMemberClick(member.memberId)}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors duration-200
                        ${selectedMember !== 'all' && selectedMember === member.memberId.toString() ? `${memberColors[member.memberId]} bg-opacity-50` : ''}
                        ${memberHoverColors[member.memberId]}
                      `}
                    >
                      <div className={`w-3 h-3 rounded ${memberColors[member.memberId]}`}></div>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
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