import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import CanvasAll from './CanvasAll';
import { updateLines, handleDraw } from '../../utils/canvasUtils';

const CanvasGrid = ({ partyId, cutIds }) => {
    const [canvasData, setCanvasData] = useState({}); // cutId별 캔버스 데이터 저장

    // WebSocket 연결 설정
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('WebSocket 연결 성공!');

                // partyId로 구독 시작
                client.subscribe(`/topic/party/${partyId}`, message => {
                    const data = JSON.parse(message.body);
                    console.log('메시지 수신:', message.body);

                    // 받은 데이터가 각 cutId에 해당하는 canvasData를 포함하는지 확인
                    if (data.cutId) {
                        // 각 cutId별로 캔버스 데이터 저장
                        setCanvasData(prevData => {
                            const updatedData = { ...prevData };
                            updatedData[data.cutId] = updateLines(updatedData[data.cutId] || [], data);

                            return updatedData;
                        });
                    }
                });
            },
            onDisconnect: () => {
                console.log('WebSocket 연결 종료');
            },
            onWebSocketError: error => {
                console.error('WebSocket 에러:', error);
            },
        });

        client.activate();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [partyId]);

    //redis 초기 그림 상태 가져오기
    useEffect(() => {
        const fetchCanvasData = async () => {
            try {
                for (let cutId of cutIds) {
                    const response = await fetch(`http://localhost:8080/cuts/${cutId}`);

                    if (!response.ok) {
                        throw new Error(`cutId ${cutId}의 데이터 조회 실패`);
                    } else {
                        const data = await response.json();
                        //console.log(data.canvasData);
                        if (data.canvasData) {
                            const savedLines = JSON.parse(data.canvasData);
                            //console.log(cutId + ' ' + savedLines);
                            setCanvasData(prevData => ({
                                ...prevData,
                                [cutId]: savedLines,
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error('캔버스 데이터를 불러오는 중 오류 발생:', error);
            }
        };

        fetchCanvasData();
    }, []);

    return (
        <div className="w-full max-w-3xl p-4">
            <div className="grid grid-cols-2 gap-4">
                {cutIds.map(cutId => {
                    const cutData = canvasData[cutId] || []; // cutId에 해당하는 캔버스 데이터 가져오기
                    return (
                        <div key={cutId} className="relative border-2 border-gray-300 rounded">
                            <div className="absolute top-2 left-2 bg-yellow-400 px-3 py-1 rounded-full">김〇〇</div>
                            <CanvasAll key={cutId} cutId={cutId} canvasData={cutData} />
                            <div className="absolute bottom-2 right-2 bg-green-400 rounded-full p-1">✓</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CanvasGrid;
