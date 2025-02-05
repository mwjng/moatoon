import React from 'react';

function MyCamera() {
    return (
        <div className="w-96 h-72 relative h-64 bg-gray-200 items-center justify-center rounded-3xl">
            <img src="" alt="자기 자신 카메라 화면" className="object-cover" />
            <span className="absolute top-2 left-2 bg-yellow-300 text-black px-2 py-1 rounded-full text-sm font-bold">
                김싸피
            </span>
        </div>
    );
}

export default MyCamera;
