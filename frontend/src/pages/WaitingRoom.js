import React, { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import Navigation from '../components/Navigation';
import MyCamera from '../components/MyCamera';
import OtherCameras from '../components/OtherCameras';
import CameraMicControls from '../components/CameraMicControls';
import BookDisplay from '../components/BookDisplay';
import FooterNotice from '../components/FooterNotice';

const APPLICATION_SERVER_URL = 'http://localhost:8080/';

function WaitingRoom() {
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));

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
            const token = await getToken();
            await newSession.connect(token, { clientData: myUserName });

            const newPublisher = await openVidu.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            newSession.publish(newPublisher);
            setSession(newSession);
            setPublisher(newPublisher);
        } catch (error) {
            console.error('There was an error connecting to the session:', error);
        }
    };

    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
    };

    const getToken = async () => {
        const sessionId = 'SessionA'; // 고정된 세션 ID 사용 또는 변경 가능
        await axios.post(`${APPLICATION_SERVER_URL}api/sessions`, { customSessionId: sessionId });
        const response = await axios.post(`${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`, {});
        return response.data;
    };

    return (
        <div className="min-h-screen bg-custom-blue flex flex-col items-center p-4 space-y-4">
            <Navigation />
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
                            <MyCamera streamManager={publisher} />
                            <CameraMicControls />
                        </div>
                        <OtherCameras subscribers={subscribers} />
                    </div>
                    <BookDisplay />
                </div>
                <div className="flex items-center justify-center">
                    <FooterNotice />
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
