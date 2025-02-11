import { useState, useEffect, useRef } from 'react';
import { authInstance } from '../api/axios';

const useFetchBooks = (memberId, isCompleted, pageSize = 10) => {
    const [bookList, setBookList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    //pageSize // 한 페이지에 불러올 책의 수 (예: 10개)
    const observerRef = useRef(null);

    const fetchBooks = async () => {
        if (loading || !hasMore || error) return; // 에러 상태일 때 요청 중단
        setLoading(true);

        try {
            const response = await authInstance.get(`/books/${memberId}`, {
                params: { isCompleted: isCompleted, page: currentPage, size: pageSize },
            });

            const newBooks = response.data.bookList || [];
            setBookList(prevBooks => [...prevBooks, ...newBooks]);

            if (newBooks.length === 0 || response.data.bookList.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            setError(err);
            setHasMore(false); // 에러 발생 시 추가 요청 중단
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [currentPage]);

    useEffect(() => {
        // 에러가 있거나 더 이상 데이터가 없을 때는 observer를 설정하지 않음
        if (error || !hasMore) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    setCurrentPage(prevPage => prevPage + 1);
                }
            },
            { threshold: 1.0 },
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loading, hasMore, error]); // error 의존성 추가

    // 에러 상태를 초기화하는 함수 추가
    const resetError = () => {
        setError(null);
        setHasMore(true);
        setCurrentPage(0);
        setBookList([]);
    };

    return { bookList, error, loading, observerRef, hasMore, resetError };
};

export default useFetchBooks;