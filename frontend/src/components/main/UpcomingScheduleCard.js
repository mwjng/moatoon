import React from 'react';

const UpcomingScheduleCard = ({ bookTitle, bookImg, sessionTime, onClick }) => {

  const handleClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onClick?.();
  };

  return (
    <div onClick={handleClick}  className="p-2 inline-block">
      <div className="w-44 pb-2 bg-butter-cream rounded-xl">
        <div className="pt-3 px-3 pb-1">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={bookImg} 
              alt="Book cover"
              className="w-full aspect-square object-cover"
            />
          </div>
        </div>
        <div className="px-2 pt-2 text-center">
          <p className="text-base truncate px-1 text-gray-800" title={bookTitle}>
            {bookTitle}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {sessionTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingScheduleCard;