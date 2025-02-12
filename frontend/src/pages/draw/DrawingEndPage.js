import React, { useState } from 'react';
import Navigation from '../../components/Navigation.js';
import ChildImg from '../../assets/child.svg';

const DrawingEndPage = () => {
    const [partyId, setpartyId] = useState(2); // 현재 방 ID
    const [cutIds, setcutIds] = useState([10, 11, 12, 13]);

    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="w-full">
                <Navigation stage="drawing" />
            </div>

            <div className="flex gap-4 p-5">
                <div className="w-72 mr-5">
                    <div className="rounded-lg overflow-hidden mb-4">
                        <img src={ChildImg} alt="참고 이미지" className="w-full mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full mb-3" />
                    </div>
                </div>
                <div className="rounded-lg overflow-hidden mb-4"></div>
            </div>
        </div>
    );
};

export default DrawingEndPage;
