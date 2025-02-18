import { useState, useEffect, useRef, useCallback } from 'react';
import { authInstance } from '../api/axios';

const useFetchBooks = (memberId, isCompleted, pageSize = 10) => {
    const [bookList, setBookList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const observerRef = useRef(null);
    const activeRequestRef = useRef(false);

    // fetchBooks를 useCallback으로 메모이제이션
    const fetchBooks = useCallback(async (page) => {
        if (!memberId || activeRequestRef.current) return;
        
        activeRequestRef.current = true;
        setLoading(true);

        try {
            const response = await authInstance.get(`/books/${memberId}`, {
                params: { isCompleted, page, size: pageSize },
            });

            const newBooks = response.data.bookList || [];
            
            setBookList(prevBooks => {
                // 페이지가 0이면 새로운 목록으로 교체
                if (page === 0) return newBooks;
                // 그렇지 않으면 기존 목록에 추가
                return [...prevBooks, ...newBooks];
            });

            setHasMore(newBooks.length === pageSize);
        } catch (err) {
            setError(err);
            setHasMore(false);
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
            activeRequestRef.current = false;
        }
    }, [memberId, isCompleted, pageSize]);

    const resetError = useCallback(() => {
        setError(null);
        setHasMore(true);
        setCurrentPage(0);
        setBookList([]);
    }, []);

    // memberId가 변경될 때 상태 초기화 및 첫 페이지 데이터 가져오기
    useEffect(() => {
        if (memberId) {
            resetError();
            fetchBooks(0);
        }
    }, [memberId, resetError, fetchBooks]);

    // 페이지 변경 시 데이터 가져오기
    useEffect(() => {
        if (memberId && currentPage > 0) {
            fetchBooks(currentPage);
        }
    }, [currentPage, memberId, fetchBooks]);

    // Intersection Observer 설정
    useEffect(() => {
        if (!observerRef.current || error || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !activeRequestRef.current) {
                    setCurrentPage(prev => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loading, hasMore, error]);

    return { 
        bookList, 
        error, 
        loading, 
        observerRef, 
        hasMore, 
        resetError,
        refresh: useCallback(() => {
            resetError();
            fetchBooks(0);
        }, [resetError, fetchBooks])
    };
};

export default useFetchBooks;