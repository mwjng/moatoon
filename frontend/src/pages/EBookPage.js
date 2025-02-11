import React, { useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import axios from 'axios';
import PaginationButton from '../components/PaginationButton';
import backgroundImage from '../assets/ebook.svg';

const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const EBookPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [comicData, setComicData] = useState({ bookTitle: '', cuts: [] });
    const cutsPerPage = 4;

    useEffect(() => {
        axios
            .get(`http://localhost:8080/books/ebook/6`)
            .then(response => {
                console.log('Fetched Data:', response.data);
                setComicData(response.data);
            })
            .catch(error => console.error('Error fetching ebook:', error));
    }, []);

    const totalPages = Math.ceil(comicData.cuts.length / cutsPerPage);

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    const displayedCuts = comicData.cuts.slice(currentPage * cutsPerPage, (currentPage + 1) * cutsPerPage);

    return (
        <div
            className="ebook-container relative max-w-2xl mx-auto p-6"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Pagination Buttons */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12">
                <PaginationButton direction="left" onClick={handlePrev} disabled={currentPage === 0} />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12">
                <PaginationButton direction="right" onClick={handleNext} disabled={currentPage === totalPages - 1} />
            </div>

            {/* Comic Content */}
            <div className="comic-grid grid grid-cols-2 gap-4 border-2 border-blue-200 p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
                {displayedCuts.map(cut => (
                    <div key={cut.cutId} className="comic-cut border border-gray-200 p-2 rounded overflow-hidden">
                        <img
                            src={`/static/upload/${cut.imageUrl}`}
                            alt={`컷 ${cut.cutOrder}`}
                            className="w-full h-48 object-contain mb-2"
                        />
                        <p
                            className="text-sm text-center text-gray-700"
                            dangerouslySetInnerHTML={{ __html: cut.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                        ></p>
                    </div>
                ))}
            </div>

            <div>
                {displayedCuts.map(cut => (
                    <div key={cut.cutId} className="comic-cut border border-gray-200 p-2 rounded overflow-hidden">
                        <p>
                            Cut {cut.cutOrder}: {cut.name}
                        </p>
                    </div>
                ))}
                {displayedCuts.length > 0 && (
                    <p className="text-right text-gray-500">{formatDate(displayedCuts[0].modifiedAt)}</p>
                )}
            </div>
        </div>
    );
};

export default EBookPage;
