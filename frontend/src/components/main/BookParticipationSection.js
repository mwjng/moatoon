import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ParticipatingBookCard from "./ParticipatingBookCard";
import useFetchBooks from '../../hooks/useLibraryBooks';

const BookParticipationSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { bookList, loading } = useFetchBooks(3, false); // TODO: 사용자 MEMBERID로 바꿔야함
  const [formattedBooks, setFormattedBooks] = useState([]);

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

  const fixedWidth = 768;

  if (loading) {
    return <div className="bg-lime-cream w-full h-full p-4 flex items-center justify-center">Loading...</div>;
  }

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
              <div className="mb-8">
                <div className="bg-white/80 rounded-[8px] px-8 py-1 inline-block">
                  <h2 className="text-lg font-bold text-gray1">참여중인 그림책</h2>
                </div>
              </div>
              
              <div style={{ width: `${fixedWidth}px` }} className="flex gap-8">
                {formattedBooks[currentPage]?.map((item) => (
                  <ParticipatingBookCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="w-16 flex-shrink-0">
              {currentPage < formattedBooks.length - 1 && (
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