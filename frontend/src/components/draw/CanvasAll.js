import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { BiPencil, BiCheck } from 'react-icons/bi';
import StoryLine from './StoryLine';

const CanvasAll = ({ cutId, canvasData, nickname, edit, toggleView, content, isReady }) => {
    const [lines, setLines] = useState([]); // 상태를 lines로 관리
    const stageRef = useRef();

    // 95%로 줄인 캔버스 너비, 높이 (300px → 285px)
    const fixedWidth = 265;
    const fixedHeight = 265;

    // WebSocket 데이터가 전달되면 해당 데이터를 lines에 추가
    useEffect(() => {
        if (canvasData) {
            setLines(canvasData);
        }
    }, [canvasData]);

    // 선 데이터 비율 조정 함수
    const scaleLinePoints = line => {
        // 원본 캔버스 크기 설정 (기본 크기)
        const originalWidth = 530;
        const originalHeight = 530;

        const scaleX = fixedWidth / originalWidth;
        const scaleY = fixedHeight / originalHeight;

        const scaledPoints = line.points.map((point, index) => {
            return index % 2 === 0 ? point * scaleX : point * scaleY;
        });

        return { points: scaledPoints };
    };

    return (
        <div className="relative w-[265px] h-[265px] border-2 border-black border-solid bg-white">
            {nickname && (
                <button className="absolute left-2 px-2.5 py-0.5 bg-light-orange text-white text-bold rounded-bl-lg rounded-br-lg shadow-md z-10 text-sm">
                    {nickname}
                </button>
            )}

            <Stage width={fixedWidth} height={fixedHeight} ref={stageRef} className="relative">
                <Layer>
                    {lines.map((line, index) => (
                        <Line
                            key={index}
                            points={scaleLinePoints(line).points} // 선 좌표 스케일링
                            stroke={line.color}
                            strokeWidth={line.width * 0.95} // 선 두께도 95%로 축소
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
                        />
                    ))}
                </Layer>
            </Stage>

            <StoryLine content={content} textSize="text-sm" leading="leading-tight" padding="p-1" />

            {edit && (
                <button
                    onClick={toggleView}
                    className="absolute top-2 right-2 w-9 h-9 bg-dark-yellow rounded-full shadow-md flex items-center justify-center"
                >
                    <BiPencil className="text-2xl" />
                </button>
            )}

            {isReady && (
                <button className="absolute bottom-2 right-2 w-9 h-9 bg-light-green rounded-full shadow-md flex items-center justify-center">
                    <BiCheck className="text-2xl" />
                </button>
            )}
        </div>
    );
};

export default CanvasAll;
