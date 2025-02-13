import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation.js';
import ChildImg from '../../assets/child.svg';
import bbi from '../../assets/bbi_normal.png';
import axios from 'axios';
import CutCard from '../../components/CutSvgCard.js';
import WordButton from '../../components/WordButton.js';

const DrawingEndPage = ({ sessionTransferResponse, onTimeout }) => {
    const [finalCuts, setFinalCuts] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const scheduledId = 11;

    useEffect(() => {
        const fetchPictures = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/cuts/final/${scheduledId}`);
                setFinalCuts(response.data);
            } catch (error) {
                console.error('그림 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchPictures();

        const timer = setTimeout(() => {
            console.log('버튼 활성화');
            setIsButtonDisabled(false);
        }, 5000); // 테스트를 위해 5초로 설정

        return () => clearTimeout(timer);
    }, [scheduledId]);

    const handleClick = () => {
        console.log('마무리 버튼 클릭');
        if (typeof onTimeout === 'function') {
            onTimeout();
        }
    };

    return (
        <div className="min-h-screen bg-light-cream-yellow">
            <div className="w-full">
                <Navigation
                    stage="endDrawing"
                    stageDuration={3}
                    sessionStartTime={sessionTransferResponse?.sessionStartTime}
                    serverTime={sessionTransferResponse?.serverTime}
                    onTimeOut={onTimeout} />
            </div>

            <div className="flex p-5">
                <div className="w-1/5 flex-shrink-0">
                    <div className="rounded-2xs overflow-hidden mb-4">
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                    </div>
                </div>

                <div className="max-w-2xl mx-auto flex flex-col items-center">
                    <div className="comic-grid grid grid-cols-2 gap-4 border-2 border-black p-4 bg-white border-solid mb-2">
                        {finalCuts.map(cut => (
                            <div
                                key={cut.id}
                                className="comic-cut border-solid border-2 border-black p-1 overflow-hidden"
                            >
                                <CutCard item={cut} />
                            </div>
                        ))}
                    </div>

                    <WordButton
                        color={isButtonDisabled ? 'bg-gray-400' : 'bg-light-orange'}
                        textColor="text-white"
                        size="small"
                        textSize="large"
                        onClick={handleClick}
                        disabled={isButtonDisabled}
                    >
                        마무리
                    </WordButton>
                </div>
                <img src={bbi} className="absolute w-36 bottom-0 right-0 object-contain" alt="bbi character" />
            </div>
        </div>
    );
};

export default DrawingEndPage;
