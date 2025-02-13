import React, { useState } from 'react';
import CanvasGrid from '../draw/CanvasGrid.js';
import ChildImg from '../../assets/child.svg';

const Overview = ({ toggleView, cutsInfo }) => {
    const partyId = cutsInfo[0].partyId;
    const cutIds = cutsInfo.map(item => item.cutId);

    const userId = 3;

    return (
        <div className="h-screen bg-light-cream-yellow">
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
