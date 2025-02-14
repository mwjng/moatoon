import React, { useEffect } from 'react';
import CanvasGrid from '../draw/CanvasGrid.js';
import ChildImg from '../../assets/child.svg';
import SubscriberVideo from '../SubscriberVideo.js';
import MyCamera from '../MyCamera.js';

const Overview = ({ toggleView, cutsInfo, subscribers, publisher, nickname }) => {
    const partyId = cutsInfo[0].partyId;
    const cutIds = cutsInfo.map(item => item.cutId);

    const userId = 3;

    return (
        <div className="h-screen bg-light-cream-yellow">
            <div className="flex p-5">
                <div className="flex flex-col mt-4 gap-8 content-evenly mx-auto ml-0 self-start">
                    {subscribers.map((subscriber, index) => (
                        <SubscriberVideo key={index} streamManager={subscriber} />
                    ))}
                    <MyCamera streamManager={publisher} nickname={nickname} />
                </div>
                <div className="flex flex-col items-center ml-24">
                    <CanvasGrid partyId={partyId} cutIds={cutIds} toggleView={toggleView} cutsInfo={cutsInfo} />
                </div>
            </div>
        </div>
    );
};

export default Overview;
