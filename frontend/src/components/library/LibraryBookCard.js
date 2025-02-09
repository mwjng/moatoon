import React from 'react';
import book from '../../assets/images/book1.png';

const LibraryBookCard = ({ item }) => {
    return (
        <div className="flex-shrink-0 w-full">
            <div className="overflow-hidden rounded-2xl">
                <img src={book} alt={item.bookTitle} className="w-full h-48 object-cover" />{' '}
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-800 text-center truncate">{item.bookTitle}</p>
            <div className="mt-1 text-xs text-gray-500 text-center">
                <p>
                    {item.startDate}~{item.endDate}
                </p>
            </div>
        </div>
    );
};

export default LibraryBookCard;
