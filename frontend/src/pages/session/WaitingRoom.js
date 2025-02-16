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
}) {
    console.log(bookInfo);
    const dispatch = useDispatch();

    useEffect(() => {
        if (scheduleId) {
            dispatch(fetchCutsInfo(scheduleId)); // API 호출
        }
    }, [dispatch, scheduleId]);

    const cutsState = useSelector(state => state.cuts);
    //console.log(cutsState);

    const handleTimeOut = () => {
        // TODO: api로 다음으로 넘어가도 되는지 체크, 불가능하다면 serverTime 받아와서 타이머 갱신..
    };

    // const { session, publisher, subscribers, joinSession, leaveSession, nickname } = useSession();

    return (
        <div className="min-h-screen bg-custom-blue flex flex-col items-center p-4 space-y-4">
            <AudioPlayer audioType="WAITING" />
            <Navigation
                stage={'waiting'}
                stageDuration={sessionDuration}
                sessionStartTime={sessionTime}
                serverTime={serverTime}
                bookTitle={bookInfo?.bookTitle}
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
                    {bookInfo && <BookDisplay bookInfo={bookInfo} />}
                </div>
                <div className="flex items-center justify-center">
                    <FooterNotice />
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
