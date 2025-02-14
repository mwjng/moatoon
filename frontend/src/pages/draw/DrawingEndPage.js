import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation.js';
import ChildImg from '../../assets/child.svg';
import bbi from '../../assets/bbi_normal.png';
import axios from 'axios';
import CutCard from '../../components/CutSvgCard.js';
import WordButton from '../../components/WordButton.js';
import { useNavigate } from 'react-router';

const DrawingEndPage = () => {
    const navigate = useNavigate();
    const [finalCuts, setFinalCuts] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 활성화 상태 관리
    const scheduledId = 12;

    //완성된 네컷 이미지 불러오기
    useEffect(() => {
        const fetchPictures = async () => {
            try {
                const response = await axios.get(`/cuts/final/${scheduledId}`);

                setFinalCuts(response.data);
            } catch (error) {
                console.error('그림 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchPictures();

        // 1분 후에 버튼 활성화
        const timer = setTimeout(() => {
            setIsButtonDisabled(false);
        }, 60000);

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
    }, [scheduledId]);

    const handleTimeOut = () => {
        navigate('/session/quiz');
    };

    return (
        <div className="min-h-screen bg-light-cream-yellow">
            <div className="w-full">
                <Navigation stage="endDrawing" onTimeOut={handleTimeOut} stageTime={3} />
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

                <div className="max-w-2xl mx-auto  flex flex-col items-center">
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
                        color={isButtonDisabled ? 'bg-gray-400' : 'bg-light-orange'} // Disabled state uses gray color
                        textColor="text-white"
                        size="small"
                        textSize="large"
                        onClick={handleTimeOut}
                        disabled={isButtonDisabled} // Disable the button when isButtonDisabled is true
                    >
                        마무리
                    </WordButton>
                </div>
                <img src={bbi} className="absolute w-36 bottom-0 right-0 object-contain" />
            </div>
        </div>
    );
};

export default DrawingEndPage;
