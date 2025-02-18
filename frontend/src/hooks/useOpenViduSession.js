import { useState, useEffect } from 'react';
import { OpenVidu } from 'openvidu-browser';
import base64 from 'base-64';
import { getSessionToken } from '../api/room';
import axios from 'axios';
import { useNavigate } from 'react-router';

const APPLICATION_SERVER_URL = 'http://localhost:8080/schedules';

const useOpenViduSession = () => {
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [nickname, setNickname] = useState('게스트');
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

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
            // 서버 응답의 에러 코드에 따라 다른 에러 상태를 전달
            let errorCode = 1000; // 기본 에러 코드
            if (error.response && error.response.data && error.response.data.code) {
                errorCode = error.response.data.code;
            }
            navigate('/session-error', { state: { errorCode } });
        }
    };

    const leaveSession = async scheduleId => {
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
