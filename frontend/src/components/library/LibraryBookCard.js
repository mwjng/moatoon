import React from 'react';
import book from '../../assets/images/book1.png';

const LibraryBookCard = ({ item }) => {
    //날짜 시간 제거
    const formatDate = date => {
        const newDate = new Date(date);
        return newDate.toISOString().split('T')[0]; // 날짜만 반환 (YYYY-MM-DD 형식)
    };

    return (
        <div className="flex-shrink-0 w-full">
            <div className="overflow-hidden rounded-2xl">
                <img src={item.bookCover} alt={item.bookTitle} className="h-56 object-cover" />{' '}
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-800 text-center truncate">{item.bookTitle}</p>
            <div className="mt-1 text-xs text-gray-500 text-center">
                <p>
                    {formatDate(item.startDate)}~{formatDate(item.endDate)}
                </p>
            </div>
        </div>
    );
};

export default LibraryBookCard;
