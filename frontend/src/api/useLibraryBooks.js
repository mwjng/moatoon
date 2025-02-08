import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchBooks = (memberId, status) => {
    const [bookList, setBookList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/books/${memberId}`, {
                    params: { status }, // status를 쿼리 파라미터로 전달
                });
                setBookList(response.data.bookList); // bookList를 상태에 저장
            } catch (err) {
                setError(err);
                console.error('Error fetching books:', err);
            }
        };

        fetchBooks();
    }, [memberId, status]);

    return { bookList, error };
};

export default useFetchBooks;
