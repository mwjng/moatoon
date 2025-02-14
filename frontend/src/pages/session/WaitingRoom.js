import React, { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import MyCamera from '../../components/MyCamera';
import CameraMicControls from '../../components/CameraMicControls';
import BookDisplay from '../../components/BookDisplay';
import FooterNotice from '../../components/FooterNotice';
import { useSession } from '../../hooks/SessionProvider';
import SubscriberVideo from '../../components/SubscriberVideo';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedules';

function WaitingRoom({ scheduleId, bookTitle, sessionTime, serverTime }) {
    const [bookInfo, setBookInfo] = useState({
        partyId: 1,
        bookTitle: '용감한 기사',
        bookCover: 'cover.jpg',
        cuts: [],
    });

    const handleTimeOut = () => {
        // TODO: api로 다음으로 넘어가도 되는지 체크, 불가능하다면 serverTime 받아와서 타이머 갱신..
    };

    const { session, publisher, subscribers, joinSession, leaveSession, nickname } = useSession();

    useEffect(() => {
        joinSession();
        return () => leaveSession();
    }, []);

    return (
        <div className="min-h-screen bg-custom-blue flex flex-col items-center p-4 space-y-4">
            <Navigation
                stage={'waiting'}
                leaveSession={leaveSession}
                stageDuration={10}
                sessionStartTime={sessionTime}
                serverTime={serverTime}
                bookTitle={bookTitle}
                onTimeOut={handleTimeOut}
            />
            <div className="justify-center items-center gap-4">
                <div
                    className="flex flex-row gap-4 justify-center items-center bg-custom-blue my-8"
                    style={{ width: '1200px' }}
                >
                    <div
                        className="flex flex-col bg-white rounded-3xl p-4 shadow-md justify-center items-center"
                        style={{ width: '900px', height: '600px' }}
                    >
                        <div className="flex flex-row gap-4 items-center justify-center" style={{ height: '300px' }}>
                            <MyCamera streamManager={publisher} nickname={nickname} />
                            <CameraMicControls publisher={publisher} />
                        </div>
                        <div className="flex flex-col mt-4 grid grid-rows-3 gap-8 content-evenly mx-auto">
                            {subscribers.map((subscriber, index) => (
                                <SubscriberVideo key={index} streamManager={subscriber} />
                            ))}
                        </div>
                    </div>
                    <BookDisplay bookInfo={bookInfo} />
                </div>
                <div className="flex items-center justify-center">
                    <FooterNotice />
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
