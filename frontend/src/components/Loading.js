import React from 'react';
import loading from '../assets/loading.svg';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <img src={loading} className="w-64" />
                <div className="flex items-center space-x-2 ">
                    <p className="text-lg font-semibold text-gray-700">로딩 중</p>
                    <p className="loading loading-dots loading-md"></p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
