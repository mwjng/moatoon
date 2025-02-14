import React, { useState, useEffect } from 'react';
import CanvasGrid from '../draw/CanvasGrid.js';
import ChildImg from '../../assets/child.svg';
import AudioPlayer from '../../components/audio/AudioPlayer'

const Overview = ({ toggleView, cutsInfo , isFirstOverviewVisit, setIsFirstOverviewVisit}) => {
    // 페이지 진입 시 Drawing 방문 상태 업데이트
    useEffect(() => {
        console.log(isFirstOverviewVisit);
        setIsFirstOverviewVisit(false);
    }, []);
    const partyId = cutsInfo[0].partyId;
    const cutIds = cutsInfo.map(item => item.cutId);

    const userId = 3;

    return (
        <div className="h-screen bg-light-cream-yellow">
            <AudioPlayer audioType="FULLCUT" isOn={isFirstOverviewVisit} />
            <div className="flex p-5">
                <div className="w-1/5 flex-shrink-0">
                    <div className="rounded-2xs overflow-hidden mb-4">
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                        <img src={ChildImg} alt="참고 이미지" className="w-full object-cover mb-3" />
                    </div>
                </div>
                <div className="flex flex-col items-center ml-24">
                    <CanvasGrid partyId={partyId} cutIds={cutIds} toggleView={toggleView} cutsInfo={cutsInfo} />
                </div>
            </div>
        </div>
    );
};

export default Overview;
