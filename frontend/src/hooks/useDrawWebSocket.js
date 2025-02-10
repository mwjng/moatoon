import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { updateLines } from '../utils/canvasUtils';

const useDrawWebSocket = (partyId, setLines) => {
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('WebSocket 연결됨');
                stompClient.current.subscribe(`/topic/party/${partyId}`, message => {
                    handleMessage(message, setLines);
                });
                console.log(`방 ${partyId}에 대한 구독 완료`);
            },
            onWebSocketError: error => {
                console.error('WebSocket 연결 오류:', error);
            },
        });

        stompClient.current.activate();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [partyId]);

    return stompClient;
};

const handleMessage = (message, setLines) => {
    console.log('메시지 수신:', message.body);
    try {
        const data = JSON.parse(message.body);
        setLines(prevLines => updateLines(prevLines, data));
    } catch (error) {
        console.error('메시지 처리 오류:', error);
    }
};

export default useDrawWebSocket;
