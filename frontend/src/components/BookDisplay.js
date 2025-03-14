import React from 'react';

function BookDisplay({ bookInfo }) {
    return (
        <div
            className="flex flex-col w-full bg-white p-3 rounded-2xl shadow-sm justify-between"
            style={{ width: '350px', height: '580px' }} 
        >
            <div
                className="text-lg text-black text-center p-2 rounded-2xl shadow-md" 
                style={{ backgroundColor: '#FFD467' }}
            >
                만들고 있는 그림책
            </div>

            <div className="mt-2 flex h-full">
                <img 
                    src={bookInfo?.bookCover} 
                    alt="그림책 이미지" 
                    className="w-full h-full object-cover rounded-lg" 
                />
            </div>
            <div
                key={bookInfo.partyId}
                className="mt-2 text-center text-black text-sm font-medium hover:text-blue-600 hover:underline cursor-pointer"
                onClick={() => window.open(`/ebook/${bookInfo.partyId}`, '_blank')}
            >
                새창에서 크게 보기
            </div>
        </div>
    );
}

export default BookDisplay;