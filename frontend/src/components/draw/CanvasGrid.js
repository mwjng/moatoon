import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import CanvasAll from './CanvasAll';
import { updateLines, handleDraw } from '../../utils/canvasUtils';
import { authInstance } from '../../api/axios';

const CanvasGrid = ({ partyId, cutIds, toggleView }) => {
    const [canvasData, setCanvasData] = useState({}); // cutId별 캔버스 데이터 저장

    // WebSocket 연결 설정
    useEffect(() => {
        const socket = new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws`);
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
                    const response = await authInstance.get(`/cuts/${cutId}`);

                    if (response.status !== 200) {
                        throw new Error(`${cutId}의 데이터 조회 실패`);
                    } else {
                        const data = response.data;
                        if (data.canvasData) {
                            const savedLines = JSON.parse(data.canvasData);
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
        <div className="flex justify-center items-center h-screen">
            <div className="p-4 border-2 border-black bg-white" style={{ border: '2px solid black' }}>
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                    {cutIds.map(cutId => {
                        const cutData = canvasData[cutId] || [];
                        return (
                            <div key={cutId} className="border-2 border-gray-300 rounded aspect-square">
                                <div className="w-full h-full">
                                    <CanvasAll key={cutId} cutId={cutId} canvasData={cutData} toggleView={toggleView} />
                                </div>
                                <button onClick={toggleView}>클릭</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CanvasGrid;
