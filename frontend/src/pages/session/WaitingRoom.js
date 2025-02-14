import React, { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import Navigation from '../../components/Navigation';
import MyCamera from '../../components/MyCamera';
import OtherCameras from '../../components/OtherCameras';
import CameraMicControls from '../../components/CameraMicControls';
import BookDisplay from '../../components/BookDisplay';
import FooterNotice from '../../components/FooterNotice';
import {getSessionToken} from '../../api/room';
import base64 from 'base-64';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedules';

function WaitingRoom({ scheduleId, bookTitle, sessionTime, serverTime}) {
    console.log("WaitingRoom props:", {
        scheduleId,
        bookTitle,
        sessionTime: sessionTime ? sessionTime.toString() : null,
        serverTime: serverTime ? serverTime.toString() : null
    });
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [nickname, setNickname] = useState('게스트');
    const token = localStorage.getItem('accessToken');
    const [bookInfo, setBookInfo] = useState({
        partyId: 1,
        bookTitle: '용감한 기사',
        bookCover: 'cover.jpg',
        cuts: [],
    });

    useEffect(() => {
        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(base64.decode(payloadBase64));
                setNickname(decodedPayload.nickname || '게스트');
            } catch (error) {
                console.error('JWT 파싱 에러', error);
            }
        }
    }, [token]);

    useEffect(() => {
        window.addEventListener('beforeunload', leaveSession);
        joinSession();

        return () => {
            window.removeEventListener('beforeunload', leaveSession);
        };
    }, []);

    const joinSession = async () => {
        const openVidu = new OpenVidu();
        const newSession = openVidu.initSession();

        newSession.on('streamCreated', event => {
            const subscriber = newSession.subscribe(event.stream, undefined);
            setSubscribers(prev => [...prev, subscriber]);
        });

        newSession.on('streamDestroyed', event => {
            setSubscribers(prev => prev.filter(sub => sub !== event.stream.streamManager));
        });

        try {
            const token = await getSessionToken();
            await newSession.connect(token, { clientData: nickname });

            const newPublisher = await openVidu.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'MANUAL',
                mirror: false,
            });

            newSession.publish(newPublisher);
            setSession(newSession);
            setPublisher(newPublisher);
        } catch (error) {
            console.error('세션 연결 에러', error);
        }
    };

    const leaveSession = async () => {
        if (session) {
            await axios.delete(`${APPLICATION_SERVER_URL}/${scheduleId}/session/leave`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
    };

    const handleTimeOut = () => {
        // TODO: api로 다음으로 넘어가도 되는지 체크, 불가능하다면 serverTime 받아와서 타이머 갱신..
    };

    return (
        <div className="min-h-screen bg-custom-blue flex flex-col items-center p-4 space-y-4">
            <Navigation stage={'waiting'} leaveSession={leaveSession} stageDuration={10} sessionStartTime={sessionTime} serverTime={serverTime} bookTitle={bookTitle} onTimeOut={handleTimeOut}/>
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
                        <OtherCameras subscribers={subscribers} />
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
