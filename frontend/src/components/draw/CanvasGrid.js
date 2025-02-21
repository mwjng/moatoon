import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import CanvasAll from './CanvasAll';
import { updateLines, handleDraw } from '../../utils/canvasUtils';
import { authInstance } from '../../api/axios';
import { useSelector } from 'react-redux';

const CanvasGrid = ({ partyId, cutIds, toggleView, cutsInfo, readyStatusResponse }) => {
    const [canvasData, setCanvasData] = useState({}); // cutId별 캔버스 데이터 저장

    //본인에게만 편집 버튼이 활성화되어야함
    const userId = useSelector(state => state.user.userInfo.id);

    // WebSocket 연결 설정
    useEffect(() => {
        const socket = new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {

                // partyId로 구독 시작
                client.subscribe(`/topic/party/${partyId}`, message => {
                    const data = JSON.parse(message.body);

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
        <div className="flex justify-center items-center -mt-14 h-screen overflow-hidden">
            <div className="p-4 border-2 border-black bg-white max-h-full" style={{ border: '2px solid black' }}>
                <div className="grid grid-cols-2 gap-4 w-full h-full max-h-full overflow-hidden">
                    {cutsInfo.map(cut => {
                        const cutData = canvasData[cut.cutId] || [];
                        return (
                            <div key={cut.cutId} className="border-2 border-gray-300 rounded aspect-square overflow-hidden">
                                <CanvasAll
                                    key={cut.cutId}
                                    cutId={cut.cutId}
                                    nickname={cut.nickname}
                                    canvasData={cutData}
                                    toggleView={toggleView}
                                    edit={userId === cut.memberId}
                                    content={cut.content}
                                    isReady={readyStatusResponse?.[cut.memberId] ?? false}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CanvasGrid;
