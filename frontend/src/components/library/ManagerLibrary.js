import React, { useRef, useEffect, useState } from 'react';
import Navigation from '../Navigation.js';
import LibraryBookCard from './LibraryBookCard.js';
import useFetchBooks from '../../hooks/useLibraryBooks.js'; // 서버 페이징 적용된 훅
import { useSelector } from 'react-redux';
import Loading from '../Loading.js';

function ManagerLibraryPage() {
    const userInfo = useSelector(state => state.user.userInfo);

    const backgroundColors = ['bg-light-cream-blue', 'bg-white', 'bg-light-blue'];
    console.log(userInfo);

    const [selectedChild, setSelectedChild] = useState(userInfo.childrenList?.[0] || null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    //selectedChild가 존재할 때만 useFetchBooks 실행
    const { bookList, loading, hasMore, observerRef, resetError } = selectedChild
        ? useFetchBooks(selectedChild.id, true)
        : { bookList: [], loading: false, hasMore: false, observerRef: null, resetError: () => {} };

    useEffect(() => {
        if (selectedChild && bookList.length === 0) {
            resetError(); // 기존 책 목록 초기화 (책이 비어있을 때만 실행)
        }
    }, [selectedChild, resetError]);

    const handleChildSelect = child => {
        if (child.id !== selectedChild?.id) {
            setSelectedChild(child);
            setIsOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-light-cream-blue flex flex-col items-start">
            {/* Navigation Bar */}
            <div className="w-full">
                <Navigation />
            </div>

            <div className="p-10">
                <div className="flex items-center justify-start gap-4 ">
                    <div className="relative w-fit min-w-[10rem]" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full bg-blue-50/70 text-gray-700 py-2.5 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-light-orange border-2 cursor-pointer shadow-sm flex items-center justify-between"
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

                        {isOpen && userInfo.childrenList && (
                            <div className="absolute z-10 w-full mt-1 bg-blue-50/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                                {userInfo.childrenList.map(child => (
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

                    <div className="text-gray-600">에피소드가 완료된 그림책은 여기서 보관돼요</div>
                </div>
            </div>

            {userInfo.childrenList && userInfo.childrenList.length > 0 ? (
                <div className="w-full">
                    {bookList
                        .reduce((rows, book, index) => {
                            if (index % 5 === 0) rows.push([]); // 새로운 행 생성
                            rows[rows.length - 1].push(book);
                            return rows;
                        }, [])
                        .map((row, rowIndex) => (
                            <div key={rowIndex} className={`w-full py-4 ${backgroundColors[rowIndex % 3]}`}>
                                {/* 책 리스트 컨테이너 (가로 제한 및 중앙 정렬) */}
                                <div className="max-w-[1000px] mx-auto grid grid-cols-5 gap-2">
                                    {row.map(book => (
                                        <div
                                            key={book.id}
                                            className="w-36 h-64 cursor-pointer"
                                            onClick={() => window.open(`/ebook/${book.id}`, '_blank')}
                                        >
                                            <LibraryBookCard item={book} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="text-gray-500 text-lg font-semibold">
                    등록된 자녀가 없습니다. 먼저 자녀를 등록해주세요.
                </div>
            )}

            {loading && <Loading />}
            <div ref={observerRef} className="h-10"></div>
        </div>
    );
}

export default ManagerLibraryPage;
