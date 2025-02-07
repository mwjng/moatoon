import React, { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ParticipatingBookCard from "./ParticipatingBookCard";

const BookParticipationSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const books = [
    [
      {
        id: 1,
        type: '책지책',
        imageUrl: '/api/placeholder/120/160',
        name: '책지책',
        bgColor: 'bg-pink-200'
      },
      {
        id: 2,
        type: '책지책',
        imageUrl: '/api/placeholder/120/160',
        name: '책지책',
        bgColor: 'bg-pink-200'
      },
      {
        id: 3,
        type: '동화',
        imageUrl: '/api/placeholder/120/160',
        name: '동화모음집의 이야기',
        bgColor: 'bg-red-100'
      },
      {
        id: 4,
        type: '만화',
        imageUrl: '/api/placeholder/120/160',
        name: '인혁, 뭐도 그래!',
        bgColor: 'bg-blue-100'
      },
      {
        id: 5,
        type: '백성국수',
        imageUrl: '/api/placeholder/120/160',
        name: '백성국수',
        bgColor: 'bg-white'
      }
    ],
    [
      {
        id: 6,
        type: '책지책',
        imageUrl: '/api/placeholder/120/160',
        name: '두 번째 페이지 책',
        bgColor: 'bg-pink-200'
      },
      {
        id: 7,
        type: '동화',
        imageUrl: '/api/placeholder/120/160',
        name: '테스트 책',
        bgColor: 'bg-red-100'
      }
    ]
  ];

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(books.length - 1, prev + 1));
  };

  const fixedWidth = 768;

  return (
    <div className="bg-lime-cream w-full h-full p-4 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-center items-center w-full">
          <div className="flex items-center gap-12">
            <div className="w-16 flex-shrink-0">
              {currentPage > 0 && (
                <button 
                  onClick={handlePrevPage}
                  className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-110"
                >
                  <MdChevronLeft size={28} className="text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-8"> {/* 여기 mb-4에서 mb-8로 변경 */}
                <div className="bg-white/80 rounded-[8px] px-8 py-1 inline-block"> {/* px-4에서 px-8로 변경 */}
                  <h2 className="text-lg font-bold text-gray1">참여중인 그림책</h2>
                </div>
              </div>
              
              <div style={{ width: `${fixedWidth}px` }} className="flex gap-8">
                {books[currentPage].slice(0, 5).map((item) => (
                  <ParticipatingBookCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="w-16 flex-shrink-0">
              {currentPage < books.length - 1 && (
                <button 
                  onClick={handleNextPage}
                  className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-110"
                >
                  <MdChevronRight size={28} className="text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookParticipationSection;