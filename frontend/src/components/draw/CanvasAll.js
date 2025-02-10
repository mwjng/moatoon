import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import useDrawWebSocket from '../../hooks/useDrawWebSocket';

const CanvasAll = ({ partyId }) => {
    const [lines, setLines] = useState([]);
    const stageRef = useRef();

    useDrawWebSocket(partyId, setLines);

    useEffect(() => {}, [lines]);

    return (
        <div className="relative w-[600px] h-[600px] border-2 border-black">
            <Stage width={600} height={600} ref={stageRef}>
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
