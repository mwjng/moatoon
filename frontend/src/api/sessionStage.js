import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const sessionStage = {
  sendReady: (scheduleId) => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('/ws');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        onConnect: () => {
          stompClient.publish({
            destination: '/app/ready',
            body: JSON.stringify({
              scheduleId
            })
          });

          resolve();
          stompClient.deactivate();
        },
        onStompError: (frame) => {
          console.error('WebSocket 연결 오류:', frame);
          reject(new Error('WebSocket 연결 실패'));
          stompClient.deactivate();
        }
      });

      stompClient.activate();
    });
  }
};