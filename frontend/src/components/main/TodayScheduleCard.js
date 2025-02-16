import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const TodayScheduleCard = ({ schedule, sessionTime, onRefresh }) => {
  const navigate = useNavigate();
  const [isWithinTenMinutes, setIsWithinTenMinutes] = useState(false);
  const [timeUntilSession, setTimeUntilSession] = useState(null);

  const handleEnterSession = () => {
    if (schedule && schedule.pinNumber) {
      navigate(`/session/${schedule.pinNumber}`);
    }
  };

  useEffect(() => {
    const checkTimeWindow = () => {
      if (!schedule || !schedule.sessionTime) return false;
      
      const sessionDateTime = new Date(schedule.sessionTime);
      const now = new Date();
      
      const timeRemaining = sessionDateTime.getTime() - now.getTime();
      setTimeUntilSession(timeRemaining);
      
      const tenMinutes = 10 * 60 * 1000;
      
      if (sessionDateTime <= now || 
          (timeRemaining <= tenMinutes && timeRemaining > tenMinutes - 1000)) {
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
        <div className="text-2xl font-bold pt-4 pb-1 text-white text-center">
          오늘의 일정
        </div>
        <div className="bg-[#FC852B] h-[200px] flex items-center justify-center rounded-xl mx-4 my-4">
          <p className="text-[#FFF3C6] text-xl">오늘의 일정이 없습니다.</p>
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
    return 'bg-[#21DA14]';
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
    return 'bg-[#FFE200] text-black hover:bg-[#FFD700]';
  };

  return (
    <div className="rounded-2xl shadow-md bg-orange1 w-[380px] h-[300px] pb-8">
      <div className="text-2xl font-bold pt-4 pb-1 text-white text-center">
        오늘의 일정
      </div>
      
      <div className="flex items-start p-4 gap-4">
        <div className="flex flex-col items-center">
          <div className="bg-[#FFF8EA] p-3 rounded-xl shadow-sm w-[160px]">
            <div className="bg-white rounded-lg mb-2 w-full h-[140px] flex items-center justify-center">
              <img 
                src={schedule.bookCover}
                alt={`${schedule.bookTitle} 표지`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="text-base font-bold text-center break-keep">
              {schedule.bookTitle}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 flex-1 justify-center h-[200px] mt-4">
          <div className="bg-orange2 px-3 py-4 rounded-xl shadow-sm flex flex-col items-center justify-center w-full h-[130px]"> 
            <div className="flex flex-col items-center w-full">
              <div className="text-lg font-bold text-[#FFF3C6]">{schedule.episodeNumber}일차</div>
              <div className="text-lg font-bold text-[#FFF3C6]">{sessionTime.slice(3)} 시작</div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <span className="text-[#5B5E65] text-sm whitespace-nowrap">{getStatusText()}</span>
            </div>
          </div>

          <button 
            className={`text-lg font-bold px-4 py-2 rounded-full shadow-sm transition-colors w-full ${getButtonStyles()}`}
            disabled={!isButtonEnabled}
            onClick={handleEnterSession}
          >
            입장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodayScheduleCard;