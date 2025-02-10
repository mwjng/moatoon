import React from 'react';

const UpcomingScheduleCard = ({ bookTitle, bookImg, sessionTime }) => {
  return (
    <div className="p-2 inline-block"> {/* inline-block으로 변경하고 너비는 내용물에 맞게 */}
      <div className="w-[130px] pb-1 bg-butter-cream rounded-xl shadow-md">
        <div className="pt-3 px-3 pb-1">
          <img 
            src={bookImg} 
            alt="Book cover"
            className="w-full  aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="p-1 text-center whitespace-nowrap">
          <p className="text-base">{bookTitle}</p>
          <p className="text-sm">{sessionTime}</p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingScheduleCard;