// ManagerBookParticipationSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ParticipatingBookCard from './ParticipatingBookCard';
import useFetchBooks from '../../hooks/useLibraryBooks';
import BookDetail from '../../components/book/BookDetail';

const ManagerBookParticipationSection = ({ childrenList }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedChild, setSelectedChild] = useState(childrenList?.[0] || null);
  const [isOpen, setIsOpen] = useState(false);
  const [formattedBooks, setFormattedBooks] = useState([]);
  const dropdownRef = useRef(null);
  
  const { bookList, loading, resetError } = useFetchBooks(selectedChild?.id, false, 5);

  // 방 상세 모달
  const [currentPartyId, setCurrentPartyId] = useState(0);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleCardClick = async(partyId) => {
    console.log("카드 클릭 시도:", partyId);
    if (!partyId || typeof partyId !== "number") {
      console.log("유효하지 않은 partyId:", partyId);
      return;
    }
    try {
      await setCurrentPartyId(partyId);
      setShowBookDetail(true);
    } catch (error) {
      console.error("카드 클릭 처리 중 에러:", error);
    }
  };

  const handleCloseModal = () => {
    setShowBookDetail(false);
    setCurrentPartyId(null);
  };

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
    if (selectedChild?.id) {
      resetError(); // API 요청을 위한 상태 초기화
      setCurrentPage(0);
      setFormattedBooks([]); // 기존 도서 목록 초기화
    }
  }, [selectedChild, resetError]);

  useEffect(() => {
    if (bookList) {
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
    } else {
      setFormattedBooks([]);
    }
  }, [bookList]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(formattedBooks.length - 1, prev + 1));
  };

  const handleChildSelect = (child) => {
    if (child.id !== selectedChild?.id) {
      setSelectedChild(child);
      setIsOpen(false);
    }
  };

  if (loading && formattedBooks.length === 0) {
    return <div className="bg-white/[0.47] rounded-xl my-8 py-4 px-6 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-white/[0.47] rounded-xl my-8 py-4 px-6">
      <div className="mb-6">
        <div className="relative w-fit min-w-[10rem]" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-blue-50/70 text-gray-700 py-2.5 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer shadow-sm flex items-center justify-between"
          >
            <span className="flex-1 text-center pr-2 truncate">
              {selectedChild ? `${selectedChild.nickname}의 그림책` : '아동 선택'}
            </span>
            <svg 
              className={`fill-current h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>
          
          {isOpen && childrenList && (
            <div className="absolute z-10 w-full mt-1 bg-blue-50/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
              {childrenList.map((child) => (
                <button
                  key={child.id}
                  className={`w-full text-center px-4 py-2.5 text-gray-700 hover:bg-blue-100/80 transition-colors ${
                    selectedChild?.id === child.id ? 'bg-blue-100/60' : ''
                  }`}
                  onClick={() => handleChildSelect(child)}
                >
                  {child.nickname}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center max-w-6xl mx-auto">
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

        <div className="flex-1">
          {formattedBooks.length > 0 ? (
            <div className="w-[750px] flex gap-8">
              {formattedBooks[currentPage]?.map((item) => (
                <ParticipatingBookCard 
                  key={item.id} 
                  item={item}
                  onClick={() => {
                    handleCardClick(item.id);
                  }}/>
              ))}
            </div>
          ) : (
            <div className="w-[750px] h-[200px] flex items-center justify-center -mt-6">
              <div className="bg-white/60 px-8 py-4 rounded-xl shadow-sm backdrop-blur-sm">
                <p className="text-gray-600 text-lg">진행 중인 그림책이 없어요!</p>
              </div>
            </div>
          )}
        </div>

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

      {showBookDetail && currentPartyId && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[90vh] overflow-hidden rounded-xl">
                <BookDetail
                  partyIdOrPin={currentPartyId}
                  onClose={handleCloseModal}
                  setModalLoading={setModalLoading}
                />
              </div>
            </div>
          </div>
          {modalLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerBookParticipationSection;