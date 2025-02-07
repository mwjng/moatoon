import React, { useState, useEffect, useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ParticipatingBookCard from './ParticipatingBookCard';

const ManagerBookList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStory, setSelectedStory] = useState('김싸피 이야기');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 더미 데이터
  const dummyBooks = [
    { id: 1, name: '안녕, 독도 고래!', imageUrl: '/api/placeholder/128/160' },
    { id: 2, name: '02.12 오후 4시', imageUrl: '/api/placeholder/128/160' },
    { id: 3, name: '안녕, 독도 고래!', imageUrl: '/api/placeholder/128/160' },
    { id: 4, name: '백설공주', imageUrl: '/api/placeholder/128/160' },
    { id: 5, name: '백설공주', imageUrl: '/api/placeholder/128/160' },
    { id: 6, name: '안녕, 독도 고래!', imageUrl: '/api/placeholder/128/160' },
    { id: 7, name: '02.12 오후 4시', imageUrl: '/api/placeholder/128/160' },
    { id: 8, name: '안녕, 독도 고래!', imageUrl: '/api/placeholder/128/160' },
  ];

  const stories = [
    '김싸피 이야기',
    '이싸피 이야기',
    '박싸피 이야기',
  ];

  const booksPerPage = 5;
  const totalPages = Math.ceil(dummyBooks.length / booksPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const currentBooks = dummyBooks.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

  return (
    <div className="bg-white/[0.47] rounded-xl my-8 py-4 px-6">
      {/* 커스텀 드롭다운 */}
      <div className="mb-6">
        <div className="relative w-44" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-blue-50/70 text-gray-700 py-2.5 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer shadow-sm flex items-center justify-between"
          >
            <span className="flex-1 text-center pr-2">{selectedStory}</span>
            <svg 
              className={`fill-current h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-blue-50/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              {stories.map((story) => (
                <button
                  key={story}
                  className={`w-full text-center px-4 py-2.5 text-gray-700 hover:bg-blue-100/80 transition-colors ${
                    selectedStory === story ? 'bg-blue-100/60' : ''
                  }`}
                  onClick={() => {
                    setSelectedStory(story);
                    setIsOpen(false);
                  }}
                >
                  {story}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center max-w-6xl mx-auto">
        {/* 왼쪽 화살표 */}
        <div className="w-12 flex-shrink-0 flex">
          {currentPage > 0 && (
            <button 
              onClick={handlePrevPage}
              className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <MdChevronLeft size={28} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* 그림책 목록 */} 
        <div className="flex-1 flex justify-center">
          <div className="flex w-[800px] justify-center">
            {[...currentBooks, ...Array(Math.max(0, 5 - currentBooks.length))].map((book, index, array) => (
              <div 
                key={book?.id || `empty-${index}`} 
                className={`w-32 flex-shrink-0 ${index !== array.length - 1 ? 'mr-8' : ''}`}
              >
                {book ? (
                  <ParticipatingBookCard 
                    item={{
                      name: book.name,
                      image: book.imageUrl
                    }} 
                  />
                ) : (
                  <div className="invisible">
                    <ParticipatingBookCard 
                      item={{
                        name: "placeholder",
                        image: "/api/placeholder/128/160"
                      }} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 화살표 */}
        <div className="w-12 flex-shrink-0 flex justify-end">
          {currentPage < totalPages - 1 && (
            <button 
              onClick={handleNextPage}
              className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <MdChevronRight size={28} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerBookList;