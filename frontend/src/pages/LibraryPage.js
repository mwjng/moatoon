import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import LibraryBookCard from '../components/library/LibraryBookCard';
import cado from '../assets/cado.svg';
import useBooks from '../api/useLibraryBooks.js'; // 커스텀 훅 임포트
import PaginationButton from '../components/PaginationButton.js';

function LibraryPage() {
    const memberId = 2; // 예시로 임의의 memberId를 사용
    const { bookList, loading } = useBooks(memberId, 'BEFORE'); // 커스텀 훅 호출
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    if (loading) {
        return <div>Loading...</div>; // 로딩 중일 때
    }

    const totalPages = Math.ceil(bookList.length / itemsPerPage);
    const currentBooks = bookList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-light-cream flex flex-col items-center">
            <div className="w-full">
                <Navigation />
            </div>
            <div className="shadow-md bg-white rounded-xl p-4 mt-6 mb-6 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <img src={cado} alt="아보카도" className="w-20 h-20" />
                    <span className="text-xl font-bold">김싸피의 도서관</span>
                    <img src={cado} alt="아보카도" className="w-20 h-20" />
                </div>
            </div>
            <div className="text-center mb-6 text-gray-600">에피소드가 완료된 그림책은 여기서 보관돼요</div>

            {/* 책 리스트 + 양쪽 화살표 */}
            <div className="flex items-center gap-4">
                {/* 왼쪽 화살표 */}
                <PaginationButton
                    direction="left"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {currentBooks.map(book => (
                        <div key={book.id} className="flex justify-center">
                            <div className="w-36 h-64">
                                <LibraryBookCard item={book} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 오른쪽 화살표 */}
                <PaginationButton
                    direction="right"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </div>
        </div>
    );
}

export default LibraryPage;
