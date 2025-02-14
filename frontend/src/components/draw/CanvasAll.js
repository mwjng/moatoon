import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { BiPencil, BiCheck } from 'react-icons/bi';

const CanvasAll = ({ cutId, canvasData, nickname, edit, toggleView, content }) => {
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
        <div className="relative w-[300px] h-[300px] border-2 border-black border-solid bg-white">
            <button className="absolute left-2 px-3 py-1 bg-light-orange text-white text-bold rounded-bl-lg rounded-br-lg shadow-md">
                {nickname}
            </button>

            <Stage width={fixedWidth} height={fixedHeight} ref={stageRef} className="relative">
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

            <div className="absolute bottom-0 w-full text-center p-2.5 text-black text-xs">
                <p
                    className="text-md text-gray-700"
                    dangerouslySetInnerHTML={{
                        __html: content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                    }}
                />
            </div>

            {edit && (
                <button
                    onClick={toggleView}
                    className="absolute top-2 right-2 w-10 h-10 bg-dark-yellow rounded-full shadow-md flex items-center justify-center"
                >
                    <BiPencil className="text-2xl" />
                </button>
            )}

            <button className="absolute bottom-2 right-2 w-10 h-10 bg-light-green rounded-full shadow-md flex items-center justify-center">
                <BiCheck className="text-2xl" />
            </button>
        </div>
    );
};

export default CanvasAll;
