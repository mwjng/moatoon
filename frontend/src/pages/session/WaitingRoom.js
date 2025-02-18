import React, { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import MyCamera from '../../components/MyCamera';
import CameraMicControls from '../../components/CameraMicControls';
import BookDisplay from '../../components/BookDisplay';
import FooterNotice from '../../components/FooterNotice';
import { useSession } from '../../hooks/SessionProvider';
import SubscriberVideo from '../../components/SubscriberVideo';
import { getSessionToken } from '../../api/room';
import base64 from 'base-64';
import AudioPlayer from '../../components/audio/AudioPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCutsInfo } from '../../store/cutsSlice';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedules';

function WaitingRoom({
    bookInfo, // {partyId, bookTitle, bookCover, cuts: Array(4)}
    scheduleId,
    sessionTime,
    serverTime,
    sessionDuration,
    publisher,
    subscribers,
    nickname,
    leaveSession,
}) {
    console.log(bookInfo);
    const dispatch = useDispatch();
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        if (scheduleId) {
            dispatch(fetchCutsInfo(scheduleId));
        }
    }, [dispatch, scheduleId]);

    const handleLeaveSession = () => {
        leaveSession();
    };

    const handleTimeOut = () => {
        // TODO: api로 다음으로 넘어가도 되는지 체크, 불가능하다면 serverTime 받아와서 타이머 갱신..
    };

    const handleTenSecondLeft = () => {
        setShowNotice(true);
        // 7초 후에 알림 숨기기
        setTimeout(() => {
            setShowNotice(false);
        }, 7000);
    };

    const cutsState = useSelector(state => state.cuts);

    return (
        <div className="min-h-screen bg-custom-blue flex flex-col overflow-hidden">
            <AudioPlayer audioType="WAITING" />
            <Navigation
                stage={'waiting'}
                stageDuration={sessionDuration}
                sessionStartTime={sessionTime}
                serverTime={serverTime}
                bookTitle={bookInfo?.bookTitle}
                onTimeOut={handleTimeOut}
                onTenSecondLeft={handleTenSecondLeft}
                leaveSession={handleLeaveSession}
            />
            <div className="flex-1 flex justify-center items-center">
                <div
                    className="flex flex-row gap-3 justify-center items-center bg-custom-blue"
                    style={{ width: '1200px' }}
                >
                    {/* 카메라 영역 */}
                    <div
                        className="flex flex-col bg-white rounded-3xl p-3 shadow-md justify-between items-center"
                        style={{ width: '900px', height: '580px' }}
                    >
                        <div className="flex flex-row gap-4 items-center justify-center" style={{ height: '300px' }}>
                            <MyCamera streamManager={publisher} nickname={nickname} />
                            <CameraMicControls publisher={publisher} />
                        </div>
                        <div className="flex flex-row mt-4 gap-8 content-evenly mx-auto">
                            {subscribers.map((subscriber, index) => (
                                <SubscriberVideo key={index} streamManager={subscriber} />
                            ))}
                        </div>
                    </div>
                    {/* 그림책 영역 */}
                    {bookInfo && <BookDisplay bookInfo={bookInfo} />}
                </div>
                {/* FooterNotice에 애니메이션 효과 추가 */}
                <div
                    className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                        showNotice ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                    <FooterNotice />
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
