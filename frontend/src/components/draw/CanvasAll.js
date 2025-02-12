import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const CanvasAll = ({ cutId, canvasData }) => {
    const [lines, setLines] = useState([]); // 상태를 lines로 관리
    const stageRef = useRef();

    // 작아진 캔버스 너비, 높이
    const fixedWidth = 300;
    const fixedHeight = 300;

    // WebSocket 데이터가 전달되면 해당 데이터를 lines에 추가
    useEffect(() => {
        if (canvasData) {
            setLines(canvasData);
        }
    }, [canvasData]);

    // 선 데이터 비율 조정 함수
    const scaleLinePoints = line => {
        // 원본 캔버스 크기 설정 (기본 크기)
        const originalWidth = 600;
        const originalHeight = 600;

        const scaleX = fixedWidth / originalWidth;
        const scaleY = fixedHeight / originalHeight;

        const scaledPoints = line.points.map((point, index) => {
            return index % 2 === 0 ? point * scaleX : point * scaleY;
        });

        return { points: scaledPoints };
    };

    return (
        <div className="w-[300px] h-[300px] border-2 border-black bg-white">
            <Stage width={fixedWidth} height={fixedHeight} ref={stageRef} style={{ border: '2px solid black' }}>
                <Layer>
                    {lines.map((line, index) => (
                        <Line
                            key={index}
                            points={scaleLinePoints(line).points} // 선 좌표 스케일링
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
