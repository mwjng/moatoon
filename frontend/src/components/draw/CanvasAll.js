import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const CanvasAll = ({ cutId, canvasData }) => {
    const [lines, setLines] = useState([]); // 상태를 lines로 관리
    const stageRef = useRef();

    // WebSocket 데이터가 전달되면 해당 데이터를 lines에 추가
    useEffect(() => {
        if (canvasData) {
            setLines(canvasData);
        }
    }, [canvasData]);

    return (
        <div className="w-[300px] h-[300px] border-2 border-black">
            <Stage width={300} height={300} ref={stageRef} style={{ border: '2px solid black' }}>
                <Layer>
                    {lines.map((line, index) => (
                        <Line
                            key={index}
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
    );
};

export default CanvasAll;
