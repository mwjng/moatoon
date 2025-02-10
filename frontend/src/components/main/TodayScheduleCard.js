import React, { useState, useEffect } from 'react';

const TodayScheduleCard = ({ schedule, sessionTime, onRefresh }) => {
  const [isWithinTenMinutes, setIsWithinTenMinutes] = useState(false);
  const [timeUntilSession, setTimeUntilSession] = useState(null);

  useEffect(() => {
    const checkTimeWindow = () => {
      if (!schedule || !schedule.sessionTime) return false;
      
      const sessionDateTime = new Date(schedule.sessionTime);
      const now = new Date();
      
      const timeRemaining = sessionDateTime.getTime() - now.getTime();
      setTimeUntilSession(timeRemaining);
      
      const tenMinutes = 10 * 60 * 1000;
      
      // 세션 시작 시간이거나 10분 전일 때 API 갱신
      if (sessionDateTime <= now || // 세션 시작 시간이 되었거나 지났을 때
          (timeRemaining <= tenMinutes && timeRemaining > tenMinutes - 1000)) { // 10분 전 (1초 이내)
        if (onRefresh) {
          onRefresh();
        }
      }
      
      return timeRemaining <= tenMinutes && timeRemaining > 0;
    };

    setIsWithinTenMinutes(checkTimeWindow());

    const timer = setInterval(() => {
      setIsWithinTenMinutes(checkTimeWindow());
    }, 1000);

    return () => clearInterval(timer);
  }, [schedule, onRefresh]);

  if (!schedule) {
    return (
      <div className="rounded-2xl shadow-md bg-orange1 w-[350px] h-[290px]">
        <div className="text-lg font-bold pt-4 pb-1 text-white text-center">
          오늘의 일정
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-white text-lg break-keep">오늘은 예정된 일정이 없습니다</p>
        </div>
      </div>
    );
  }

  const isButtonEnabled = schedule.sessionStage !== 'WAITING' || (schedule.sessionStage === 'WAITING' && isWithinTenMinutes);

  const getStatusColor = () => {
    const sessionDateTime = new Date(schedule.sessionTime);
    const now = new Date();
    if (schedule.sessionStage === 'WAITING' && (!isWithinTenMinutes || sessionDateTime <= now)) {
      return 'bg-red-500';
    }
    return 'bg-[#21DA14]'; // 더 밝은 초록색으로 변경
  };

  const getStatusText = () => {
    const getStageText = () => {
      switch(schedule.sessionStage) {
        case 'WAITING': return '대기 중';
        case 'WORD': return '단어 학습 중';
        case 'DRAWING': return '그림 그리기 중';
        default: return '대기 중';
      }
    };

    if (schedule.sessionStage === 'WAITING') {
      const sessionDateTime = new Date(schedule.sessionTime);
      const now = new Date();
      if (sessionDateTime <= now) {
        if (onRefresh) {
          onRefresh();
        }
        return '서비스 오류';
      }
      
      if (!isWithinTenMinutes) {
        const tenMinutes = 10 * 60 * 1000;
        const waitingTime = timeUntilSession - tenMinutes;
        const minutes = Math.ceil(waitingTime / (60 * 1000));
        return `${minutes}분 후 입장 가능`;
      }
    }
    
    return getStageText();
  };

  const getButtonStyles = () => {
    if (!isButtonEnabled) {
      return 'bg-[#E1E2E6] text-[#5B5E65]';
    }
    return 'bg-[#FFE200] text-black hover:bg-[#FFD700]'; // 입장 가능할 때의 버튼 스타일
  };

  return (
    <div className="rounded-2xl shadow-md bg-orange1 w-[380px] h-[290px]">
      <div className="text-2xl font-bold pt-4 pb-1 text-white text-center">
        오늘의 일정
      </div>
      
      <div className="flex items-start p-4 gap-4">
        <div className="flex flex-col items-center">
          <div className="bg-[#FFF8EA] p-3 rounded-xl shadow-sm">
            <div className="bg-white rounded-lg mb-2">
              <img 
                src={schedule.bookCover}
                alt={`${schedule.bookTitle} 표지`}
                className="w-[130px] h-[140px] aspect-square object-cover rounded-lg"
              />
            </div>
            <span className="text-base font-bold text-center block break-keep whitespace-pre-wrap text-sm">
              {schedule.bookTitle}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 flex-1 justify-center h-[200px]">
          <div className="bg-orange2 px-3 py-4 rounded-xl shadow-sm flex flex-col items-center justify-center w-full h-[130px]"> 
            <div className="text-xs text-center w-full flex flex-col">
              <div className="text-lg font-bold text-[#FFF3C6] whitespace-nowrap">{schedule.episodeNumber}일차</div>
              <div className="text-lg font-bold text-[#FFF3C6] whitespace-nowrap">{sessionTime.slice(3)} 시작</div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <span className="text-[#5B5E65] text-sm break-keep">{getStatusText()}</span>
            </div>
          </div>

          <button 
            className={`text-lg font-bold px-4 py-2 rounded-full shadow-sm transition-colors w-full break-keep ${getButtonStyles()}`}
            disabled={!isButtonEnabled}
          >
            입장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodayScheduleCard;