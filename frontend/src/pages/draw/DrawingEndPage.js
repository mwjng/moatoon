import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation.js';
import ChildImg from '../../assets/child.svg';
import axios from 'axios';
import CutCard from '../../components/CutSvgCard.js';
import WordButton from '../../components/WordButton.js';

const DrawingEndPage = () => {
    const [finalCuts, setFinalCuts] = useState([]);
    const scheduledId = 11; // 현재 방 ID

    useEffect(() => {
        const fetchPictures = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/cuts/final/${scheduledId}`);
                //console.log(response.data);
                setFinalCuts(response.data);
            } catch (error) {
                console.error('그림 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchPictures();
    }, [scheduledId]);

    return (
        <div className="min-h-screen bg-light-cream-yellow">
            <div className="w-full">
                <Navigation stage="endDrawing" />
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

                    <WordButton color="bg-light-orange" textColor="text-white" size="small" textSize="large">
                        마무리
                    </WordButton>
                </div>
            </div>
        </div>
    );
};

export default DrawingEndPage;
