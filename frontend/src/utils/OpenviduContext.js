import React, { createContext, useState, useEffect, useContext } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { getSessionToken } from '../api/room';
import base64 from 'base-64';

const OpenViduContext = createContext();

export const useOpenVidu = () => useContext(OpenViduContext);

export const OpenViduProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [nickname, setNickname] = useState('게스트');
    const token = localStorage.getItem('accessToken');

    // JWT에서 닉네임 가져오기
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

    // OpenVidu 세션 초기화
    const initializeSession = async () => {
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
            const sessionToken = await getSessionToken();
            await newSession.connect(sessionToken, { clientData: nickname });

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

    // 세션 정리
    const leaveSession = async () => {
        if (session) {
            await session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
    };

    useEffect(() => {
        initializeSession();
        return () => {
            leaveSession();
        };
    }, []);

    const value = {
        session,
        publisher,
        subscribers,
        nickname,
        leaveSession,
    };

    return <OpenViduContext.Provider value={value}>{children}</OpenViduContext.Provider>;
};
