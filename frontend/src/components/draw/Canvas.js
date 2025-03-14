import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ToolBar from './ToolBar';
import WordButton from '../WordButton';
import { authInstance } from '../../api/axios';
import { useSessionStageWebSocket } from '../../hooks/useSessionStageWebSocket';
import { useDispatch, useSelector } from 'react-redux';
import { setLines, addLine, undoLine, redoLine, clearCanvas } from '../../store/canvasSlice';
import StoryLine from './StoryLine';

const Canvas = ({ sendReady, stageRef, toggleView, partyId, cutId, cutIds, userStory, readyStatus }) => {
    const [tool, setTool] = useState('pen');
    const [penColor, setPenColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const isDrawing = useRef(false);
    const touchStarted = useRef(false);
    const lastPointerType = useRef(null);

    const stompClient = useRef(null); // stompClient를 useRef로 초기화
    const [connected, setConnected] = useState(false); // WebSocket 연결 상태

    const dispatch = useDispatch();
    const { lines, undoneLines } = useSelector(state => state.canvas);

    // 웹소켓 훅 사용
    const handleComplete = async () => {
        if (readyStatus) {
            // 이미 완료 상태면 ready 상태를 false로 변경
            sendReady(!readyStatus); // ready 상태 토글
            return;
        }
        await handleExportCanvasData(); // 캔버스 데이터 임시 저장
        sendReady(!readyStatus); // 완료 신호 전송
    };

    //redis에 cut 초기화 데이터 추가
    useEffect(() => {
        const initializeCanvasData = async () => {
            try {
                const response = await authInstance.post('/cuts/init-canvas', cutIds, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status !== 200) {
                    throw new Error('캔버스 초기화 실패');
                }

            } catch (error) {
                console.error('캔버스 초기화 중 오류 발생:', error);
            }
        };

        initializeCanvasData();
    }, []);

    // 웹소켓 클라이언트 초기화
    useEffect(() => {
        const socket = new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws`);
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);
            },
            onDisconnect: () => {
                setConnected(false);
            },
            onWebSocketError: error => {
                console.error('WebSocket 에러:', error);
                setConnected(false);
            },
        });

        stompClient.current.activate();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [partyId]);

    //canvas에 그린 데이터 임시저장
    const sendCanvasData = async canvasData => {
        const requestData = {
            cutId: cutId,
            canvasData: canvasData,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await authInstance.post('/cuts/save-temp', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                return response;
            } else {
                console.error('캔버스 임시 저장 실패:', response.status);
            }
        } catch (error) {
            console.error('캔버스 임시 저장 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        const saveCanvasData = () => {
            if (!connected || !stompClient.current) return;

            const canvasData = JSON.stringify(lines);
            sendCanvasData(canvasData);
        };

        const intervalId = setInterval(saveCanvasData, 1000); // 캔버스 임시저장 1초마다 실행

        return () => clearInterval(intervalId);
    }, [lines, connected]);

    const handlePointerDown = e => {
        // 완료 상태일 때는 그리기 비활성화
        if (readyStatus) return;

        const pointerType = e.evt.pointerType;
        lastPointerType.current = pointerType;

        // 터치 이벤트일 경우 스크롤을 위해 이벤트를 그대로 전달
        if (pointerType === 'touch' && tool !== 'pen') {
            touchStarted.current = true;
            return;
        }

        e.evt.preventDefault();
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLine = {
            tool,
            color: penColor,
            width: strokeWidth,
            points: [pos.x, pos.y],
        };

        dispatch(addLine(newLine));
    };

    const handlePointerMove = e => {
        // 완료 상태일 때는 그리기 비활성화
        if (readyStatus) return;
        
        const pointerType = e.evt.pointerType;

        // 터치 이벤트이고 터치가 시작됐다면 스크롤을 위해 이벤트를 그대로 전달
        if (pointerType === 'touch' && touchStarted.current) {
            return;
        }

        if (!isDrawing.current) return;

        e.evt.preventDefault();
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        const updatedLines = [...lines];
        const lastLine = { ...updatedLines[updatedLines.length - 1] };
        lastLine.points = [...lastLine.points, point.x, point.y];
        updatedLines[updatedLines.length - 1] = lastLine;

        dispatch(setLines(updatedLines));

        if (connected && stompClient.current) {
            const messageData = {
                partyId,
                cutId,
                type: 'draw',
                line: lastLine,
            };
            stompClient.current.publish({
                destination: '/app/draw',
                body: JSON.stringify(messageData),
            });
        }
    };

    const handlePointerUp = e => {
        const pointerType = e.evt.pointerType;

        // 터치 이벤트 종료
        if (pointerType === 'touch') {
            touchStarted.current = false;
            return;
        }

        isDrawing.current = false;
    };

    // 터치 이벤트 중에 우발적인 그리기를 방지하기 위한 핸들러
    const handleTouchStart = e => {
        if (e.touches.length === 1) {
            touchStarted.current = true;
        }
    };

    const handleTouchEnd = () => {
        touchStarted.current = false;
    };

    // Stage에 터치 이벤트 리스너 추가
    useEffect(() => {
        const stage = stageRef.current;
        if (stage) {
            stage.addEventListener('touchstart', handleTouchStart);
            stage.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (stage) {
                stage.removeEventListener('touchstart', handleTouchStart);
                stage.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, []);

    const handleUndo = () => {
        // 완료 상태일 때는 편집 기능 비활성화
        if (readyStatus || lines.length === 0) return;
        dispatch(undoLine());

        //서버로 UNDO 신호 전송
        if (connected && stompClient.current) {
            stompClient.current.publish({
                destination: '/app/draw',
                body: JSON.stringify({
                    partyId: partyId,
                    cutId: cutId,
                    type: 'UNDO',
                }),
            });
        }
    };

    const handleRedo = () => {
        // 완료 상태일 때는 편집 기능 비활성화
        if (readyStatus || undoneLines.length === 0) return;
        dispatch(redoLine());

        //서버로 REDO 신호 전송
        if (connected && stompClient.current) {
            stompClient.current.publish({
                destination: '/app/draw',
                body: JSON.stringify({
                    partyId: partyId,
                    cutId: cutId,
                    type: 'REDO',
                    redoLine: undoneLines[undoneLines.length - 1],
                }),
            });
        }
    };

    const handleClear = () => {
        // 완료 상태일 때는 편집 기능 비활성화
        if (readyStatus) return;
        dispatch(clearCanvas());

        if (connected && stompClient.current) {
            stompClient.current.publish({
                destination: '/app/draw',
                body: JSON.stringify({
                    partyId: partyId,
                    cutId: cutId,
                    type: 'CLEAR',
                }),
            });
        }
    };

    const exportCanvasState = () => {
        const canvasState = JSON.stringify(lines);
        return canvasState;
    };

    const handleExportCanvasData = async () => {
        const canvasState = exportCanvasState();
        await sendCanvasData(canvasState); // sendCanvasData 함수 호출로 변경
    };

    const [isSaving, setIsSaving] = useState(false);

    async function handleViewAll() {
        if (isSaving) return;
        setIsSaving(true);
        try {
            await handleExportCanvasData(); // 저장 완료될 때까지 기다림
            toggleView(); // 저장 후 화면 전환
        } catch (error) {
            console.error('데이터 저장 중 오류 발생:', error);
        } finally {
            setIsSaving(false);
        }
    }

    // 완료 버튼 스타일 계산 - disabled 속성 제거
    const completeBtnColor = readyStatus ? "bg-gray-400 hover:bg-gray-500" : "bg-light-orange hover:bg-yellow-400";

    return (
        <div
            className="flex bg-white"
            style={{
                width: '530px',
                height: '530px',
                position: 'relative',
            }}
        >
            <div className="flex flex-col w-full relative">
                <div className="relative">
                    <Stage
                        width={530}
                        height={530}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        style={{ border: '2px solid black', touchAction: 'none' }}
                        ref={stageRef}
                    >
                        <Layer>
                            {lines.map((line, i) => (
                                <Line
                                    key={i}
                                    points={line.points}
                                    stroke={line.color}
                                    strokeWidth={line.width}
                                    tension={0.5}
                                    lineCap="round"
                                    globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
                <StoryLine
                    content={userStory[0].content}
                    textSize="text-lg"
                    leading="leading-relaxed"
                    padding="p-2.5"
                />

                {readyStatus && (
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-85"
                        style={{ pointerEvents: 'none', zIndex: 1 }}
                    >
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">그림그리기를 완료하였어요!</p>
                            <p className="text-lg text-gray-600 mt-2">수정하시려면 완료됨 버튼을 다시 눌러주세요</p>
                        </div>
                    </div>
                )}
                <div className="flex justify-center gap-4 mt-3">
                    <WordButton
                        color="bg-light-orange"
                        textColor="text-white"
                        size="md"
                        textSize="large"
                        onClick={handleViewAll}
                    >
                        전체 보기
                    </WordButton>
                    <WordButton
                        color={completeBtnColor}
                        textColor="text-white"
                        size="md"
                        textSize="large"
                        onClick={handleComplete}
                    >
                        {readyStatus ? "완료됨" : "완료"}
                    </WordButton>
                </div>
            </div>
            <div className="flex flex-col">
                <ToolBar
                    setPenColor={setPenColor}
                    setStrokeWidth={setStrokeWidth}
                    setMode={setTool}
                    undo={handleUndo}
                    redo={handleRedo}
                    clearCanvas={handleClear}
                />
            </div>
        </div>
    );
};

export default Canvas;