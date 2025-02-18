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
    const [comicData, setComicData] = useState({ bookTitle: '', cuts: [] });
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

    const totalPages = Math.ceil(comicData.cuts.length / cutsPerPage);

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    const displayedCuts = comicData.cuts.slice(currentPage * cutsPerPage, (currentPage + 1) * cutsPerPage);

    return (
        <div className="min-h-screen bg-light-cream  bg-[#FEFBEB]">
            {isLoading ? (
                <div>
                    <Loading />
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    {/* Pagination Buttons */}
                    <div>
                        <PaginationButton direction="left" onClick={handlePrev} disabled={currentPage === 0} />
                    </div>
                    <div className="flex pt-5 justify-center">
                        {/* 이미지 삽입 */}
                        <img src={backgroundImage} alt="background" className="absolute max-w-5xl object-cover" />

                        {/* Comic Content */}
                        <div className="mt-20 w-[600px] comic-grid max-w-xl grid grid-cols-2 gap-4 border-2 border-black p-4 bg-white border-solid relative z-10">
                            {displayedCuts.map(cut => (
                                <div
                                    key={cut.cutId}
                                    className="comic-cut border-solid border-2 border-black p-1 overflow-hidden"
                                >
                                    <CutCard item={cut} />
                                </div>
                            ))}
                        </div>

                        <div className="ml-5 flex flex-col space-y-2 relative z-10">
                            <div className="mt-auto flex flex-col space-y-1">
                                {displayedCuts.map(cut => (
                                    <div key={cut.cutId} className="comic-cut border border-gray-200 p-2 rounded">
                                        <span className="mr-4 whitespace-nowrap">
                                            Cut {cut.cutOrder}: {cut.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto text-gray-900 text-xl font-bold">
                                {displayedCuts.length > 0 && (
                                    <p className="mt-2">{formatDate(displayedCuts[0].modifiedAt)}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <PaginationButton
                        direction="right"
                        onClick={handleNext}
                        disabled={currentPage === totalPages - 1}
                    />

                    {/* <div
                        className="max-w-4xl ebook-container relative mx-auto p-6 aspect-[5/3] "
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                        }}
                    >
                        
                        <div className="comic-grid grid grid-cols-2 gap-4 border-2 border-black p-4 bg-white border-solid">
                            {displayedCuts.map(cut => (
                                <div
                                    key={cut.cutId}
                                    className="comic-cut  border-solid border-2 border-black p-1 overflow-hidden"
                                >
                                    <CutCard item={cut} />
                                </div>
                            ))}
                        </div>

                        <div className="ml-5 flex flex-col space-y-2">
                            <div className="mt-auto flex flex-col space-y-1">
                                {displayedCuts.map(cut => (
                                    <div key={cut.cutId} className="comic-cut border border-gray-200 p-2 rounded">
                                        <span className="mr-4 whitespace-nowrap">
                                            Cut {cut.cutOrder}: {cut.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto text-gray-900 text-xl font-bold">
                                {displayedCuts.length > 0 && (
                                    <p className="mt-2">{formatDate(displayedCuts[0].modifiedAt)}</p>
                                )}
                            </div>
                        </div>
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default EBookPage;
