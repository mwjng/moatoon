import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation.js';
import bbi from '../../assets/bbi_normal.png';
import { authInstance } from '../../api/axios';
import CutCard from '../../components/CutSvgCard.js';
import WordButton from '../../components/WordButton.js';
import SubscriberVideo from '../../components/SubscriberVideo.js';
import MyCamera from '../../components/MyCamera.js';
import AudioPlayer from '../../components/audio/AudioPlayer';
import { useSelector } from 'react-redux';

const DrawingEndPage = ({
    scheduleId,
    sessionStageData,
    onTimeout,
    publisher,
    subscribers,
    nickname,
    leaveSession,
}) => {
    const [finalCuts, setFinalCuts] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 활성화 상태 관리

    const { lines, undoneLines } = useSelector(state => state.canvas);

    const cutsState = useSelector(state => state.cuts);
    const userId = useSelector(state => state.user.userInfo.id);
    const cutId = cutsState.cuts.find(item => item.memberId === userId)?.cutId;

    useEffect(() => {
        const uploadAndFetch = async () => {
            await fetchPictures(); // 업로드 후 이미지 가져오기
        };

        uploadAndFetch();

        // 10초 후에 버튼 활성화
        const timer = setTimeout(() => {
            console.log('버튼 활성화');
            setIsButtonDisabled(false);
        }, 10000);

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
    }, [scheduleId]);

    const handleClick = () => {
        if (typeof onTimeout === 'function') {
            console.log('마무리 버튼 클릭');
            onTimeout();
        }
    };

    const handleLeaveSession = () => {
        leaveSession();
    };

    const fetchPictures = async () => {
        try {
            const response = await authInstance.get(`/cuts/final/${scheduleId}`);
            setFinalCuts(response.data);
        } catch (error) {
            console.error('그림 데이터를 불러오는 중 오류 발생:', error);
        }
    };

    return (
        <div className="min-h-screen bg-light-cream-yellow">
            <AudioPlayer audioType="SHARING" />
            <div className="w-full">
                <Navigation
                    stage="endDrawing"
                    stageDuration={180} // ! DrawingEndPage Duration은 3*60=180초
                    sessionStartTime={sessionStageData?.sessionStartTime}
                    serverTime={sessionStageData?.serverTime}
                    onTimeOut={onTimeout}
                    leaveSession={handleLeaveSession}
                />
            </div>

            <div className="flex flex-col items-center px-4 relative -mt-10">
                <div className="flex max-w-5xl w-full justify-center gap-8 mt-6">
                    {/* Camera section */}
                    <div className="flex flex-col gap-2.5 w-48">
                        <MyCamera streamManager={publisher} nickname={nickname} small />
                        {subscribers.map((subscriber, index) => (
                            <SubscriberVideo key={index} streamManager={subscriber} small />
                        ))}
                    </div>

                    {/* Comic strips section */}
                    <div className="flex flex-col items-center">
                        <div className="w-[570px] comic-grid grid grid-cols-2 gap-4 border-2 border-black p-4 bg-white border-solid mb-4">
                            {finalCuts.map(cut => (
                                <div
                                    key={cut.id}
                                    className="comic-cut border-solid border-2 border-black overflow-hidden"
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
                </div>

                {/* Character image */}
                <img src={bbi} className="absolute w-36 bottom-0 right-0 object-contain" alt="bbi character" />
            </div>
        </div>
    );
};

export default DrawingEndPage;
