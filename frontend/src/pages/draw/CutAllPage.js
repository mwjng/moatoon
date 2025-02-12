import React, { useState } from 'react';
import CanvasAll from '../../components/draw/CanvasAll.js';
import Navigation from '../../components/Navigation.js';
import CanvasGrid from '../../components/draw/CanvasGrid.js';
import WordButton from '../../components/WordButton.js';
import ChildImg from '../../assets/child.svg';

const CutAllPage = () => {
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
                <div className="rounded-lg overflow-hidden mb-4">
                    <CanvasGrid partyId={partyId} cutIds={cutIds} />
                    <WordButton color="bg-dark-yellow w-full mt-5" size="md">
                        완료
                    </WordButton>
                </div>
            </div>
        </div>
    );
};

export default CutAllPage;
