import { useState, useEffect } from 'react';
import { OpenVidu } from 'openvidu-browser';
import base64 from 'base-64';
import utf8 from 'utf8';
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
            console.log('accessToken: ', accessToken);
            const payloadBase64 = accessToken.split('.')[1];
            console.log('payloadBase64: ', payloadBase64);
            const base64Decode = base64.decode(payloadBase64);
            console.log('base64Decode: ', base64Decode);
            const utf8Decode = utf8.decode(base64Decode);
            console.log('utf8Decode: ', utf8Decode);
            const decodedPayload = JSON.parse(utf8.decode(base64.decode(payloadBase64)));
            console.log('decodedPayload', decodedPayload);

            const decoded = jwtDecode(accessToken);
            console.log('decoded: ', decoded);
            console.log('nickname: ', decoded.nickname);
            return decoded.nickname || '게스트';
        } catch (error) {
            console.error('JWT 파싱 에러', error);
            return '게스트';
        }
    };
    const nickname = parseNicknameFromToken();

    // useEffect(() => {
    //     if (accessToken) {
    //         try {
    //             const payloadBase64 = accessToken.split('.')[1];
    //             const decodedPayload = JSON.parse(utf8.decode(base64.decode(payloadBase64)));
    //             console.log(decodedPayload);
    //             setNickname(decodedPayload.nickname || '게스트');
    //         } catch (error) {
    //             console.error('JWT 파싱 에러', error);
    //         }
    //     }
    // }, [accessToken]);

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
            // 서버 응답의 에러 코드에 따라 다른 에러 상태를 전달
            let errorCode = 1000; // 기본 에러 코드
            if (error.response && error.response.data && error.response.data.code) {
                errorCode = error.response.data.code;
            }
            //navigate('/session-error', { state: { errorCode } });
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
