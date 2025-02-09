import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const useFetchBooks = (memberId, status) => {
    const [bookList, setBookList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [pageSize] = useState(10); // 한 페이지에 불러올 책의 수 (예: 10개)
    const observerRef = useRef(null);

    const fetchBooks = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:8080/books/${memberId}`, {
                params: { status, page: currentPage, size: pageSize },
            });

            const newBooks = response.data.bookList || [];
            setBookList(prevBooks => [...prevBooks, ...newBooks]);

            // 서버에서 더 이상 데이터가 없으면 hasMore을 false로 설정
            if (newBooks.length === 0 || response.data.bookList.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            setError(err);
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [currentPage]); // currentPage가 변경될 때마다 fetchBooks 호출

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    setCurrentPage(prevPage => prevPage + 1); // 새로운 페이지 요청
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
    }, [loading, hasMore]);

    return { bookList, error, loading, observerRef, hasMore };
};

export default useFetchBooks;
