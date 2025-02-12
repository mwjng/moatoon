import { useState, useEffect, useRef, useCallback } from 'react';
import { authInstance } from '../api/axios';

const useFetchBooks = (memberId, isCompleted, pageSize = 10) => {
    const [bookList, setBookList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const observerRef = useRef(null);

    // fetchBooks를 useCallback으로 메모이제이션
    const fetchBooks = useCallback(async () => {
        if (loading || !hasMore || error || !memberId) return;
        setLoading(true);

        try {
            const response = await authInstance.get(`/books/${memberId}`, {
                params: { isCompleted, page: currentPage, size: pageSize },
            });

            const newBooks = response.data.bookList || [];
            setBookList(prevBooks => [...prevBooks, ...newBooks]);

            if (newBooks.length === 0 || response.data.bookList.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            setError(err);
            setHasMore(false);
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    }, [memberId, isCompleted, currentPage, pageSize, loading, hasMore, error]);

    // resetError를 useCallback으로 메모이제이션
    const resetError = useCallback(() => {
        setError(null);
        setHasMore(true);
        setCurrentPage(0);
        setBookList([]);
    }, []);

    // memberId가 변경될 때만 상태 초기화
    useEffect(() => {
        if (memberId) {
            resetError();
        }
    }, [memberId, resetError]);

    // 데이터 페칭
    useEffect(() => {
        if (memberId) {
            fetchBooks();
        }
    }, [memberId, currentPage, fetchBooks]);

    // Intersection Observer 설정
    useEffect(() => {
        if (!observerRef.current || error || !hasMore) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading && hasMore) {
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

    return { bookList, error, loading, observerRef, hasMore, resetError };
};

export default useFetchBooks;