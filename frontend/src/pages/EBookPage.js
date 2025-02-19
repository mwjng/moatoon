import React, { useState, useEffect } from 'react';
import { authInstance } from '../api/axios';
import PaginationButton from '../components/PaginationButton';
import backgroundImage from '../assets/ebook1.png';
import CutCard from '../components/CutSvgCard';
import { useParams } from 'react-router';
import Loading from '../components/Loading';

const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const EBookPage = () => {
    const { partyId } = useParams();
    const [currentPage, setCurrentPage] = useState(0);
    const [comicData, setComicData] = useState({ bookTitle: '', bookCover: '', cuts: [] });
    const [isLoading, setIsLoading] = useState(true);
    const cutsPerPage = 4;

    useEffect(() => {
        setIsLoading(true);
        authInstance
            .get(`/books/ebook/${partyId}`)
            .then(response => {
                console.log('Fetched Data:', response.data);
                setComicData(response.data);
            })
            .catch(error => console.error('Error fetching ebook:', error))
            .finally(() => setIsLoading(false));
    }, []);

    const totalPages = Math.ceil(comicData.cuts.length / cutsPerPage) + 1;

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    const displayedCuts = comicData.cuts.slice((currentPage - 1) * cutsPerPage, currentPage * cutsPerPage);

    return (
        <div className="min-h-screen bg-light-cream bg-[#FEFBEB]">
            {isLoading ? (
                <div>
                    <Loading />
    
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    {currentPage !== 0 && (
                        <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10">
                            <PaginationButton direction="left" onClick={handlePrev} />
                        </div>
                    )}

                    <div className="flex pt-5 justify-center">
                        <img src={backgroundImage} alt="background" className="absolute max-w-5xl object-cover" />

                        {currentPage === 0 ? (
                            <div className="flex flex-col items-center mt-8 p-8 z-10 relative h-screen">
                                <div className="h-[100%] rounded-2xl p-16 mr-9">
                                <h1 className="text-3xl font-bold bg-gradient-to-r bg-clip-text bg-black text-transparent text-center mb-5">
                                                {comicData.bookTitle}
                                            </h1>
                                    <div className="flex flex-col md:flex-row gap-10  h-[90%] overflow-hidden">
                                        
                                        <div className="relative flex-1">
                                            <div className="absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-25"></div>
                                            <img
                                                src={comicData.bookCover}
                                                alt="Book Cover"
                                                className="relative w-full h-[500px] object-cover rounded-lg shadow-lg"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-1 space-y-6 h-[80%]">

                                            <div className="space-y-5">
                                                <div className="bg-gray-50 p-6 rounded-lg h-[30%] overflow-y-auto">
                                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">개요</h2>
                                                    <p className="text-lg text-gray-600 leading-relaxed overflow-y-auto">
                                                        {comicData.introduction}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-50 p-6 rounded-lg">
                                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">일정</h2>
                                                    <p className="text-lg text-gray-600">
                                                        {formatDate(comicData.startDate)} ~{' '}
                                                        {formatDate(comicData.endDate)}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-50 p-6 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xl font-semibold text-gray-800">
                                                            진행률
                                                        </span>
                                                        <span className="text-xl font-bold text-orange2">
                                                            {Math.round(
                                                                (comicData.progressCount / comicData.episodeCount) *
                                                                    100,
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                                                        <div
                                                            className="bg-gradient-to-r from-light-orange to-orange2 h-3 rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${(comicData.progressCount / comicData.episodeCount) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mt-24 w-[600px] comic-grid max-w-xl grid grid-cols-2 gap-4 border-2 border-black p-4 bg-white border-solid relative z-10">
                                    {displayedCuts.map(cut => (
                                        <div
                                            key={cut.cutId}
                                            className="comic-cut border-solid border-2 border-black p-1 overflow-hidden"
                                        >
                                            <CutCard item={cut} />
                                        </div>
                                    ))}
                                </div>

                                <div className="ml-10 flex flex-col space-y-2 relative z-10">
                                    <div className="mt-auto flex flex-col space-y-1">
                                        {displayedCuts.map(cut => (
                                            <div
                                                key={cut.cutId}
                                                className="comic-cut border border-gray-200 p-2 rounded"
                                            >
                                                <span className="mr-4 whitespace-nowrap text-xl">
                                                    Cut {cut.cutOrder}: {cut.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto text-gray-900 text-2xl font-bold">
                                        {displayedCuts.length > 0 && (
                                            <p className="mt-2">{formatDate(displayedCuts[0].modifiedAt)}</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {currentPage !== totalPages - 1 && (
                        <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10">
                            <PaginationButton direction="right" onClick={handleNext} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EBookPage;
