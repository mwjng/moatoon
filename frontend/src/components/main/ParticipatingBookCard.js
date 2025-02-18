import React from 'react';

const ParticipatingBookCard = ({ item, onClick }) => {
  const formatOpeningTime = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      date.setHours(date.getHours() + 9);
      
      if (isNaN(date.getTime())) return null;
      
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      return {
        date: `${month}.${day}`,
        time: `${ampm} ${hours}:${minutes}`
      };
    } catch (error) {
      console.error('Date formatting error:', error);
      return null;
    }
  };

  const handleClick = (e) => {
    console.log('카드 클릭됨:', item?.id);
    e.stopPropagation(); // 이벤트 버블링 방지
    onClick?.();
  };

  const openingTime = formatOpeningTime(item?.startDate);
  const showOverlay = item?.status === 'BEFORE' && openingTime;

  return (
    <div 
      onClick={handleClick} 
      className="flex-shrink-0 w-32 cursor-pointer hover:scale-105 transition-transform"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
    >
      <div className={`overflow-hidden rounded-2xl relative ${item?.bgColor || ''}`}>
        <img
          src={item?.bookCover}
          alt={item?.bookTitle || '책 이미지'}
          className="w-full h-40 object-cover"
          onError={(e) => {
            console.log('이미지 로드 실패:', item?.bookCover);
          }}
        />

        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50" />
            <div className="relative bg-white bg-opacity-90 py-3 w-full text-center">
              <p className="text-xs text-gray-800">
                {openingTime.date} {openingTime.time}
              </p>
              <p className="text-xs text-gray-800 mt-1">오픈 예정</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-800 text-center truncate">
        {item?.bookTitle || '제목 없음'}
      </p>
    </div>
  );
};

export default ParticipatingBookCard;