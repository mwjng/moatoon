import { useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { getSessionToken } from '../api/room';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const useOpenViduSession = () => {
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    const parseNicknameFromToken = () => {
        if (!accessToken) return '게스트';

        try {
            const decoded = jwtDecode(accessToken);
            return decoded.nickname || '게스트';
        } catch (error) {
            console.error('JWT 파싱 에러', error);
            return '게스트';
        }
    };
    const nickname = parseNicknameFromToken();

    const joinSession = async scheduleId => {
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
            const token = await getSessionToken(scheduleId);
            console.log('token: ', token.token);
            console.log('nickname: ', nickname);
            await newSession.connect(token.token, { clientData: nickname });

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
            let errorCode = 1000; // 기본 에러 코드
            if (error.response && error.response.data && error.response.data.code) {
                errorCode = error.response.data.code;
            }
        }
    };

    const leaveSession = async scheduleId => {
        if (session) {
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/schedules/${scheduleId}/session/leave`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
    };

    return {
        session,
        publisher,
        subscribers,
        nickname,
        joinSession,
        leaveSession,
    };
};

export default useOpenViduSession;
