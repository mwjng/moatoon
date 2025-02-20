import React, { useRef, useEffect, useCallback } from 'react';
import Navigation from '../Navigation.js';
import LibraryBookCard from './LibraryBookCard.js';
import cado from '../../assets/kado.png';
import useFetchBooks from '../../hooks/useLibraryBooks.js'; // 서버 페이징 적용된 훅
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import Loading from '../Loading.js';

function ChildLibraryPage() {
    const userInfo = useSelector(state => state.user.userInfo);
    const { bookList, loading, hasMore, observerRef } = useFetchBooks(userInfo.id, true); // TODO: userInfo.id 뽑아서 넣어줘야함.
    const colsPerRow = 5; // 한 줄당 책 개수
    const backgroundColors = ['bg-light-cream', 'bg-white', 'bg-lime-cream'];

    return (
        <div className="min-h-screen bg-light-cream flex flex-col items-center">
            <div className="w-full">
                <Navigation />
            </div>
            <div className="shadow-md bg-white rounded-xl p-4 mt-6 mb-6 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <img src={cado} alt="아보카도" className="h-16" />
                    <span className="text-xl font-bold m-3">{userInfo.nickname}의 도서관</span>
                    <img src={cado} alt="아보카도" className="h-16" />
                </div>
            </div>
            <div className="text-center mb-6 text-gray-600">에피소드가 완료된 그림책은 여기서 보관돼요</div>
            {/* 책 리스트 */}
            <div className="w-full">
                {bookList
                    .reduce((rows, book, index) => {
                        if (index % colsPerRow === 0) rows.push([]);
                        rows[rows.length - 1].push(book);
                        return rows;
                    }, [])
                    .map((row, rowIndex) => (
                        <div key={rowIndex} className={`flex gap-6 py-12 ${backgroundColors[rowIndex % 3]}`}>
                            {/* 책들을 감싸는 고정 너비의 컨테이너 추가 */}
                            <div className="mx-auto w-[930px] flex justify-start w-[1000px] space-x-12">
                                {row.map(book => (
                                    <div
                                        key={book.id}
                                        className="w-44 h-64 cursor-pointer"
                                        onClick={() => window.open(`/ebook/${book.id}`, '_blank')}
                                    >
                                        <LibraryBookCard item={book} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
            {loading && <Loading />}
            {/*!hasMore && <div className="mt-4 text-gray-500"></div>*/}
            <div ref={observerRef} className="h-10"></div>
        </div>
    );
}

export default ChildLibraryPage;
