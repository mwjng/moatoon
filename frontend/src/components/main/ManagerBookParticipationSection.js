import React, { useState, useEffect, useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ParticipatingBookCard from './ParticipatingBookCard';
import useFetchBooks from '../../hooks/useLibraryBooks';

const ManagerBookParticipationSection = ({ memberId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStory, setSelectedStory] = useState('김싸피 이야기');
  const [isOpen, setIsOpen] = useState(false);
  const [formattedBooks, setFormattedBooks] = useState([]);
  const dropdownRef = useRef(null);
  
  const { bookList, loading } = useFetchBooks(3, false);

  const stories = [
    '김싸피 이야기',
    '이싸피 이야기',
    '박싸피 이야기',
  ];

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

  useEffect(() => {
    if (bookList) {
      // 5개씩 나누어 2차원 배열 생성
      const chunkedBooks = bookList.reduce((acc, book, i) => {
        const chunkIndex = Math.floor(i / 5);
        if (!acc[chunkIndex]) acc[chunkIndex] = [];
        
        acc[chunkIndex].push({
          id: book.id,
          status: book.status,
          bookCover: book.bookCover,
          bookTitle: book.bookTitle,
          bgColor: book.status === 'BEFORE' ? 'bg-gray-200' : 'bg-blue-100',
          startDate: book.startDate
        });
        
        return acc;
      }, []);
      
      setFormattedBooks(chunkedBooks);
    }
  }, [bookList]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(formattedBooks.length - 1, prev + 1));
  };

  if (loading) {
    return <div className="bg-white/[0.47] rounded-xl my-8 py-4 px-6 flex items-center justify-center">Loading...</div>;
  }

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
        <div className="flex-1">
          <div className="w-[750px] flex gap-8">
            {formattedBooks[currentPage]?.map((item) => (
              <ParticipatingBookCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* 오른쪽 화살표 */}
        <div className="w-12 flex-shrink-0 flex justify-end">
          {currentPage < formattedBooks.length - 1 && (
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

export default ManagerBookParticipationSection;