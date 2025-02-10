import React from 'react';
import BookImg from '../../assets/images/book2.png';

const TodayScheduleCard = ({ schedule, sessionTime }) => {
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

  return (
    <div className="rounded-2xl shadow-md bg-orange1 w-[350px] h-[290px]">
      {/* Header - 중앙 정렬된 흰색 텍스트 */}
      <div style={{ fontSize: '25px'}} className="text-lg font-bold pt-4 pb-1 text-white text-center">
        오늘의 일정
      </div>
      
      {/* Main Content Container */}
      <div className="flex items-start p-4 gap-4">
        {/* Left Side - 책의 이미지와 타이틀이 있는 카드 */}
        <div className="flex flex-col items-center">
          <div className="bg-[#FFF8EA] p-3 rounded-xl shadow-sm">
            <div className="bg-white rounded-lg mb-2">
              <img 
                src={schedule.bookCover || BookImg}
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
        
        {/* Right Side - 일정 정보와 버튼 */}
        <div className="flex flex-col gap-3 w-full justify-center w-[160px] h-[200px]">
          {/* 일정 정보 */}
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

          {/* Button - 세션 상태에 따라 다른 버튼 표시 */}
          <button 
            style={{ fontSize: '17px' }}
            className={`text-lg font-bold px-4 py-2 rounded-full shadow-sm transition-colors w-full
              ${schedule.sessionStage === 'BEFORE' 
                ? 'bg-[#E1E2E6] text-[#5B5E65]' 
                : 'bg-orange2 text-white'}`}
            disabled={schedule.sessionStage === 'BEFORE'}
          >
            {getButtonText(schedule.sessionStage)}
          </button>
        </div>
      </div>
    </div>
  );
};

// 세션 상태에 따른 버튼 텍스트 반환
const getButtonText = (stage) => {
  switch (stage) {
    case 'BEFORE':
      return '10분 전 입장 가능';
    case 'WAITING':
      return '입장하기';
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