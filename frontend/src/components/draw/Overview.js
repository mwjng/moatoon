import React, { useEffect, useState } from 'react';
import CanvasGrid from '../draw/CanvasGrid.js';
import ChildImg from '../../assets/child.svg';
import SubscriberVideo from '../SubscriberVideo.js';
import MyCamera from '../MyCamera.js';

import AudioPlayer from '../../components/audio/AudioPlayer';

const Overview = ({
    toggleView,
    cutsInfo,
    isFirstOverviewVisit,
    setIsFirstOverviewVisit,
    subscribers,
    publisher,
    nickname,
}) => {
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
