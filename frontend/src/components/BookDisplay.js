import React from 'react';

function BookDisplay() {
    return (
        <div
            className="flex flex-col w-full bg-white p-4 rounded-2xl shadow-md justify-between "
            style={{ width: '300px', height: '600px' }}
        >
            <div className="text-lg text-black text-center p-2 rounded-2xl" style={{ backgroundColor: '#FFD467' }}>
                만들고 있는 그림책
            </div>
            <div className="mt-2 flex h-full">
                <img src="" alt="그림책 이미지" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="mt-2 text-center text-black text-sm font-medium">새창에서 크게 보기</div>
        </div>
    );
}

export default BookDisplay;
