import React from "react";

const BookDetail = ({ coverImage, storySummary }) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
                <h2 className="text-xl font-bold mb-4">📖 완성된 동화책</h2>
                <img src={coverImage} alt="동화책 표지" className="w-full h-auto rounded-lg" />
                <p className="mt-4">{storySummary}</p>
            </div>
        </div>
    );
};

export default BookDetail;
