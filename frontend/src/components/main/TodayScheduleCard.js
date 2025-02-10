import React, { useState, useEffect } from 'react';

const TodayScheduleCard = ({ schedule, sessionTime }) => {
  const [isWithinTenMinutes, setIsWithinTenMinutes] = useState(false);

  useEffect(() => {
    const checkTimeWindow = () => {
      if (!schedule || !schedule.sessionTime) return false;
      
      const sessionDateTime = new Date(schedule.sessionTime);
      const now = new Date();
      
      // 세션 시작까지 남은 시간 (밀리초)
      const timeUntilSession = sessionDateTime.getTime() - now.getTime();
      
      // 10분을 밀리초로 변환
      const tenMinutes = 10 * 60 * 1000;
      
      // 10분 이내이고 아직 시작 시간이 지나지 않았으면 true
      return timeUntilSession <= tenMinutes && timeUntilSession > 0;
    };

    // 초기 체크
    setIsWithinTenMinutes(checkTimeWindow());

    // 1초마다 시간 체크
    const timer = setInterval(() => {
      setIsWithinTenMinutes(checkTimeWindow());
    }, 1000);

    return () => clearInterval(timer);
  }, [schedule]);

  // schedule이 없을 경우 표시할 내용
  if (!schedule) {
    return (
      <div className="rounded-2xl shadow-md bg-orange1 w-[350px] h-[290px]">
        <div style={{ fontSize: '25px'}} className="text-lg font-bold pt-4 pb-1 text-white text-center">
          오늘의 일정
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-white text-lg">오늘은 예정된 일정이 없습니다</p>
        </div>
      </div>
    );
  }

  // 버튼 활성화 조건:
  // 1. WAITING 상태가 아니면 항상 활성화
  // 2. WAITING 상태일 때는 10분 이내일 때만 활성화
  const isButtonEnabled = schedule.sessionStage !== 'WAITING' || (schedule.sessionStage === 'WAITING' && isWithinTenMinutes);

  return (
    <div className="rounded-2xl shadow-md bg-orange1 w-[350px] h-[290px]">
      {/* Header */}
      <div style={{ fontSize: '25px'}} className="text-lg font-bold pt-4 pb-1 text-white text-center">
        오늘의 일정
      </div>
      
      {/* Main Content Container */}
      <div className="flex items-start p-4 gap-4">
        {/* Left Side */}
        <div className="flex flex-col items-center">
          <div className="bg-[#FFF8EA] p-3 rounded-xl shadow-sm">
            <div className="bg-white rounded-lg mb-2">
              <img 
                src={schedule.bookCover}
                alt={`${schedule.bookTitle} 표지`}
                style={{ width: '280px', height: '130px' }}
                className='aspect-square object-cover rounded-lg'
              />
            </div>
            <span style={{ fontSize: '14px' }} className="text-base font-bold text-center block">
              {schedule.bookTitle}
            </span>
          </div>
        </div>
        
        {/* Right Side */}
        <div className="flex flex-col gap-3 w-full justify-center w-[160px] h-[200px]">
          <div className="bg-orange2 px-3 py-4 rounded-xl shadow-sm flex items-center justify-center w-full h-[130px]"> 
            <div className="text-xs text-center w-full">
              <div style={{ fontSize: '17px', color: '#FFF3C6'}} className="text-base font-bold">
                {schedule.episodeNumber}일차
              </div>
              <div style={{ fontSize: '17px', color: '#FFF3C6'}} className="text-base font-bold">
                {sessionTime} 시작
              </div>
            </div>
          </div>

          <button 
            style={{ fontSize: '17px' }}
            className={`text-lg font-bold px-4 py-2 rounded-full shadow-sm transition-colors w-full
              ${isButtonEnabled 
                ? 'bg-orange2 text-white hover:bg-orange-600' 
                : 'bg-[#E1E2E6] text-[#5B5E65]'}`}
            disabled={!isButtonEnabled}
          >
            {getButtonText(schedule.sessionStage, isWithinTenMinutes)}
          </button>
        </div>
      </div>
    </div>
  );
};

// 세션 상태에 따른 버튼 텍스트 반환
const getButtonText = (stage, isWithinTenMinutes) => {
  switch (stage) {
    case 'WAITING':
      return isWithinTenMinutes ? '입장하기' : '10분 전 입장 가능';
    case 'WORD':
      return '단어 선택하기';
    case 'DRAWING':
      return '그림 그리기';
    case 'DONE':
      return '완료';
    default:
      return '10분 전 입장 가능';
  }
};

export default TodayScheduleCard;