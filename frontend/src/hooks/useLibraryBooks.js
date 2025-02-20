import { useState, useEffect, useRef, useCallback } from 'react';
import { authInstance } from '../api/axios';

const useFetchBooks = (memberId, isCompleted, pageSize = 5) => {
    const [bookList, setBookList] = useState([]); // 실제로 화면에 보여주는 책 목록
    const [nextPageBookList, setNextPageBookList] = useState([]); // 새로운 페이지에서 받아온 책 목록
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const observerRef = useRef(null);
    const activeRequestRef = useRef(false);

    // fetchBooks는 currentPage에 따라 데이터 불러오기
    const fetchBooks = useCallback(
        async page => {
            if (!memberId || activeRequestRef.current) return;

            activeRequestRef.current = true;
            setLoading(true);

            try {
                const response = await authInstance.get(`/books/${memberId}`, {
                    params: { isCompleted, page, size: pageSize },
                });

                const newBooks = response.data.bookList || [];

                setBookList(prevBooks => {
                    // 첫 페이지일 때만 새로운 데이터로 덮어쓰고, 그 외에는 덧붙여서 추가
                    if (page === 0) {
                        return newBooks;
                    }
                    return [...prevBooks, ...newBooks];
                });

                setNextPageBookList(newBooks);

                // 새로운 데이터가 pageSize보다 적다면, 더 이상 불러올 데이터가 없다고 판단
                setHasMore(newBooks.length === pageSize);
            } catch (err) {
                setError(err);
                setHasMore(false);
                console.error('Error fetching books:', err);
            } finally {
                setLoading(false);
                activeRequestRef.current = false;
            }
        },
        [memberId, isCompleted, pageSize],
    );

    const resetError = useCallback(() => {
        setError(null);
        setHasMore(true);
        setCurrentPage(0);
        setBookList([]);
        setNextPageBookList([]);
    }, []);

    // memberId가 변경될 때마다 데이터 초기화하고 첫 페이지 로딩
    useEffect(() => {
        if (memberId) {
            resetError();
            fetchBooks(0); // 첫 페이지 로딩
        }
    }, [memberId, resetError, fetchBooks]);

    // currentPage가 변경될 때마다 해당 페이지 데이터 불러오기
    useEffect(() => {
        if (memberId && currentPage > 0) {
            fetchBooks(currentPage);
        }
    }, [currentPage, memberId, fetchBooks]);

    // Intersection Observer 설정 (무한 스크롤)
    useEffect(() => {
        if (!observerRef.current || error || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !activeRequestRef.current) {
                    setCurrentPage(prev => prev + 1); // 자동으로 다음 페이지로 넘어감
                }
            },
            { threshold: 1.0 },
        );

        observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loading, hasMore, error]);

    // 네비게이션 버튼을 통한 페이지 변경
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return {
        bookList, // 현재 페이지 책 + 다음 페이지 책
        nextPageBookList,
        error,
        loading,
        observerRef,
        hasMore,
        currentPage,
        setCurrentPage, // 페이지 변경을 위해 setCurrentPage 제공
        resetError,
        refresh: useCallback(() => {
            resetError();
            fetchBooks(0); // 새로고침 시 첫 페이지 데이터 불러오기
        }, [resetError, fetchBooks]),
        handlePrevPage, // 이전 페이지로 이동
        handleNextPage, // 다음 페이지로 이동
    };
};

export default useFetchBooks;
