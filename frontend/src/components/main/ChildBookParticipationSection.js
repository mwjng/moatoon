import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import ParticipatingBookCard from './ParticipatingBookCard';
import useFetchBooks from '../../hooks/useLibraryBooks';
import { useSelector } from 'react-redux';
import BookDetail from '../../components/book/BookDetail';

const ChildBookParticipationSection = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const [showBookDetail, setShowBookDetail] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [currentPartyId, setCurrentPartyId] = useState(0);

    const { nextPageBookList, loading, hasMore, currentPage, setCurrentPage, handlePrevPage, handleNextPage } =
        useFetchBooks(userInfo.id, false, 5);

    // 방 상세 모달
    const handleCardClick = async partyId => {
        if (!partyId || typeof partyId !== 'number') return;
        setCurrentPartyId(partyId);
        setShowBookDetail(true);
    };

    const handleCloseModal = () => {
        setShowBookDetail(false);
        setCurrentPartyId(null);
    };

    const fixedWidth = 768;

    // const handlePrevPage = () => {
    //     setCurrentPage(prev => Math.max(0, prev - 1));
    // };

    // const handleNextPage = () => {
    //     if (hasMore) {
    //         setCurrentPage(prev => prev + 1);
    //     }
    //     console.log(bookList);
    // };

    // 데이터 로딩 상태 표시
    if (loading) {
        return (
            <div className="bg-lime-cream w-full h-full p-4 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    const hasBooks = nextPageBookList && nextPageBookList.length > 0;

    return (
        <div className="bg-lime-cream w-full h-full p-4 flex items-center">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex justify-center items-center w-full">
                    <div className="flex items-center gap-12">
                        <div className="w-16 flex-shrink-0">
                            {hasBooks && currentPage > 0 && (
                                <button
                                    onClick={handlePrevPage}
                                    className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-110"
                                >
                                    <MdChevronLeft
                                        size={28}
                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                    />
                                </button>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="mb-5">
                                <div className="bg-white/80 rounded-[8px] px-8 py-1 inline-block">
                                    <h2 className="text-lg font-bold text-gray1">참여중인 그림책</h2>
                                </div>
                            </div>

                            {hasBooks ? (
                                <div style={{ width: `${fixedWidth}px` }} className="flex gap-8">
                                    {nextPageBookList.map(item => (
                                        <ParticipatingBookCard
                                            key={item.id}
                                            item={item}
                                            onClick={() => handleCardClick(item.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div
                                    style={{ width: `${fixedWidth}px`, height: '180px' }}
                                    className="flex flex-col items-center justify-center bg-white/80 rounded-xl border border-gray-100 shadow-sm"
                                >
                                    <div className="text-center px-8 py-6">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-lime-100 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-lime-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 font-medium mb-2">참여중인 그림책이 없습니다</p>
                                        <p className="text-gray-500 text-sm">새로운 그림책에 참여해보세요!</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-16 flex-shrink-0">
                            {hasBooks && hasMore && (
                                <button
                                    onClick={handleNextPage}
                                    className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-110"
                                >
                                    <MdChevronRight
                                        size={28}
                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showBookDetail && currentPartyId && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div
                            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
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

export default ChildBookParticipationSection;
