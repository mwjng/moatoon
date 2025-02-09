import React, { useRef, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import LibraryBookCard from '../components/library/LibraryBookCard';
import cado from '../assets/cado.svg';
import useFetchBooks from '../api/useLibraryBooks.js'; // 서버 페이징 적용된 훅
import { debounce } from 'lodash';

function LibraryPage() {
    const memberId = 2;
    const { bookList, loading, hasMore, observerRef } = useFetchBooks(memberId, 'BEFORE');
    const colsPerRow = 5; // 한 줄당 책 개수
    const backgroundColors = ['bg-light-cream', 'bg-white', 'bg-lime-cream'];

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
            {/* 책 리스트 */}
            <div className="w-full">
                {bookList
                    .reduce((rows, book, index) => {
                        if (index % colsPerRow === 0) rows.push([]); // 새로운 줄 만들기
                        rows[rows.length - 1].push(book);
                        return rows;
                    }, [])
                    .map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`flex justify-center gap-6 py-4 ${backgroundColors[rowIndex % 3]}`}
                        >
                            {row.map(book => (
                                <div key={book.id} className="w-36 h-64">
                                    <LibraryBookCard item={book} />
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
            {loading && <div className="mt-4 text-gray-500">Loading...</div>}
            {/*!hasMore && <div className="mt-4 text-gray-500"></div>*/}
            <div ref={observerRef} className="h-10">
                더 이상 불러올 책이 없습니다.
            </div>{' '}
            {/* 스크롤할 영역 */}
        </div>
    );
}

export default LibraryPage;
