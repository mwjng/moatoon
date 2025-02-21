import React, { useEffect } from 'react';
import CanvasGrid from '../draw/CanvasGrid.js';
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
    readyStatusResponse,
}) => {
    // 페이지 진입 시 Drawing 방문 상태 업데이트
    useEffect(() => {
        setIsFirstOverviewVisit(false);
    }, []);

    const partyId = cutsInfo[0].partyId;
    const cutIds = cutsInfo.map(item => item.cutId);

    return (
        <div className="bg-light-cream-yellow h-screen flex flex-col items-center">
            <AudioPlayer audioType="FULLCUT" isOn={isFirstOverviewVisit} />
            
            <div className="w-full max-w-6xl flex flex-col items-center justify-center mt-4">
                <div className="flex w-full justify-center gap-8">
                    {/* 카메라 부분 - 세로 정렬된 비디오 컨테이너 */}
                    <div className="flex flex-col gap-2 h-[600px] w-48 mt-4">
                        <MyCamera streamManager={publisher} nickname={nickname} small />
                        {subscribers.map((subscriber, index) => (
                            <SubscriberVideo key={index} streamManager={subscriber} small />
                        ))}
                    </div>

                    {/* Canvas 그리드 부분 */}
                    <div className="w-[700px] flex justify-center items-center">
                        <CanvasGrid
                            partyId={partyId}
                            cutIds={cutIds}
                            toggleView={toggleView}
                            cutsInfo={cutsInfo}
                            readyStatusResponse={readyStatusResponse}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;