import React from 'react';
import BookImg from '../../assets/images/book2.png'

const TodayScheduleCard = () => {
  return (
    <div 
      className="rounded-2xl shadow-md bg-orange1 w-[350px] h-[290px]" 
    >
      {/* Header - 중앙 정렬된 흰색 텍스트 */}
      <div style={{ fontSize: '25px'}} className="text-lg font-bold pt-4 pb-1 text-white text-center">
        오늘의 일정
      </div>
      
      {/* Main Content Container */}
      <div className="flex items-start p-4 gap-4"> {/* h-full 추가 */}
        {/* Left Side - 책의 이미지와 타이틀이 있는 카드드 */}
        <div className="flex flex-col items-center">
          <div className="bg-[#FFF8EA] p-3 rounded-xl shadow-sm">
            <div className="bg-white rounded-lg mb-2">
              <img 
                src={BookImg}
                alt="돼지책 캐릭터"
                style={{ width: '280px', height: '130px' }}
                className='aspect-square object-cover rounded-lg'
              />
            </div>
            <span style={{ fontSize: '14px' }} className="text-base font-bold text-center block">
              돼지책
            </span>
          </div>
        </div>
        
        {/* Right Side - 일정 정보와 버튼 */}
        <div className="flex flex-col gap-3 w-full justify-center w-[160px] h-[200px]" > {/* 세로 중앙 정렬을 위해 justify-center 추가 */}
          {/* 일정 정보 */}
          <div 
            className="bg-orange2 px-3 py-4 rounded-xl shadow-sm flex items-center justify-center w-full h-[130px]"> 
            <div className="text-xs text-center w-full">
              <div style={{ fontSize: '17px', color: '#FFF3C6'}} className="text-base font-bold">2일차</div>
              <div style={{ fontSize: '17px', color: '#FFF3C6'}} className="text-base font-bold">오후 6시 시작</div>
            </div>
          </div>

          {/* Button */}
          <button 
            style={{ fontSize: '17px' }}
            className="bg-[#E1E2E6] text-[#5B5E65] text-lg font-bold px-4 py-2 rounded-full shadow-sm 
                      transition-colors w-full"
          >
            입장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodayScheduleCard;
