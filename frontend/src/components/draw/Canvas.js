import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Client } from '@stomp/stompjs';
import { Link } from 'react-router';
import SockJS from 'sockjs-client';
import ToolBar from './ToolBar';
import WordButton from '../WordButton';

const Canvas = ({ stageRef }) => {
    const [tool, setTool] = useState('pen');
    const [penColor, setPenColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [lines, setLines] = useState([]);
    const [undoneLines, setUndoneLines] = useState([]);
    const isDrawing = useRef(false);
    //const stageRef = useRef();
    const stompClient = useRef(null); // stompClient를 useRef로 초기화
    const [connected, setConnected] = useState(false); // WebSocket 연결 상태

    //임시 설정
    const [partyId, setpartyId] = useState(2); // 예시로 방 ID를 설정
    const [cutId, setcutId] = useState(12);
    const [cutIds, setcutIds] = useState([10, 11, 12, 13]);

    //redis에 cut 초기화 데이터 추가
    useEffect(() => {
        const initializeCanvasData = async () => {
            try {
                const response = await fetch('http://localhost:8080/cuts/init-canvas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cutIds), // 기본 cutId 리스트 전달
                });

                if (!response.ok) {
                    throw new Error('캔버스 초기화 실패');
                }

                console.log('캔버스 데이터 초기화 성공');
            } catch (error) {
                console.error('캔버스 초기화 중 오류 발생:', error);
            }
        };

        initializeCanvasData();
    }, []);

    // 웹소켓 클라이언트 초기화
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('WebSocket 연결 성공!');
                setConnected(true);
            },
            onDisconnect: () => {
                console.log('WebSocket 연결 종료');
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
    const sendCanvasData = canvasData => {
        const requestData = {
            cutId: cutId,
            canvasData: canvasData,
            timestamp: new Date().toISOString(),
        };

        fetch('http://localhost:8080/cuts/save-temp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => {
                if (response.ok) {
                    console.log('캔버스 임시 저장 성공');
                } else {
                    console.error('캔버스 임시 저장 실패:', response.status);
                }
            })
            .catch(error => console.error('캔버스 임시 저장 중 오류 발생:', error));
    };

    useEffect(() => {
        const saveCanvasData = () => {
            if (!connected || !stompClient.current) return;

            const canvasData = JSON.stringify(lines);
            sendCanvasData(canvasData);
        };

        const intervalId = setInterval(saveCanvasData, 30000); // 30초마다 실행

        return () => clearInterval(intervalId);
    }, [lines, connected]);

    //임시저장한 데이터 불러오기
    useEffect(() => {
        const fetchCanvasData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/cuts/${cutId}`);
                if (!response.ok) throw new Error('캔버스 데이터 조회 실패');

                const data = await response.json();
                if (data.canvasData) {
                    setLines(JSON.parse(data.canvasData)); // 저장된 데이터를 캔버스에 반영
                }
            } catch (error) {
                console.error('캔버스 데이터를 불러오는 중 오류 발생:', error);
            }
        };

        fetchCanvasData();
    }, [cutId]);

    const handleMouseDown = e => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLine = {
            tool,
            color: penColor,
            width: strokeWidth,
            points: [pos.x, pos.y],
        };

        setLines(prevLines => [...prevLines, newLine]);
    };

    const handleMouseMove = e => {
        if (!isDrawing.current) return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        setLines(prevLines => {
            const newLines = [...prevLines];
            const lastLine = { ...newLines[newLines.length - 1] };
            lastLine.points = [...lastLine.points, point.x, point.y];
            newLines[newLines.length - 1] = lastLine;

            if (connected && stompClient.current) {
                const messageData = {
                    partyId: partyId,
                    cutId: cutId,
                    type: 'draw',
                    line: lastLine,
                };
                stompClient.current.publish({
                    destination: '/app/draw',
                    body: JSON.stringify(messageData),
                });
            }

            return newLines;
        });
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleUndo = () => {
        if (lines.length === 0) return;
        setUndoneLines([...undoneLines, lines[lines.length - 1]]);
        setLines(lines.slice(0, -1));

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
        if (undoneLines.length === 0) return;
        setLines([...lines, undoneLines[undoneLines.length - 1]]);
        setUndoneLines(undoneLines.slice(0, -1));
        console.log(undoneLines[undoneLines.length - 1]);

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
        setLines([]);
        setUndoneLines([]);
    };

    const exportCanvasState = () => {
        const canvasState = JSON.stringify(lines);
        console.log('내보내는 캔버스 상태:', canvasState);

        return canvasState;
    };

    const handleExportCanvasData = () => {
        const canvasState = exportCanvasState();
        sendCanvasData(canvasState); // sendCanvasData 함수 호출로 변경
    };

    return (
        <div className="flex bg-white" style={{ width: '600px', height: '600px', position: 'relative' }}>
            <div className="flex flex-col">
                <Stage
                    width={600}
                    height={600}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ border: '2px solid black' }}
                    ref={stageRef}
                >
                    <Layer>
                        {lines.map((line, i) => (
                            <Line
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
                <div className="flex justify-center gap-4 mt-4">
                    <Link to="/session/overview">
                        <WordButton
                            color="bg-light-orange"
                            textColor="text-white"
                            size="md"
                            textSize="large"
                            onClick={handleExportCanvasData}
                        >
                            전체 보기
                        </WordButton>
                    </Link>
                    <WordButton
                        color="bg-light-orange hover:bg-yellow-400"
                        textColor="text-white"
                        size="md"
                        textSize="large"
                    >
                        완료
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
