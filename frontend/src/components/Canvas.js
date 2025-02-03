import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import ToolBar from './ToolBar';

const Canvas = () => {
    // 사용자가 선택한 도구, 색상, 굵기 상태 관리
    const [tool, setTool] = useState('pen');
    const [penColor, setPenColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [lines, setLines] = useState([]);
    const [undoneLines, setUndoneLines] = useState([]);
    const isDrawing = useRef(false);

    const handleMouseDown = e => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, color: penColor, width: strokeWidth, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = e => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleUndo = () => {
        if (lines.length === 0) return;
        setUndoneLines([...undoneLines, lines[lines.length - 1]]);
        setLines(lines.slice(0, -1));
    };

    const handleRedo = () => {
        if (undoneLines.length === 0) return;
        setLines([...lines, undoneLines[undoneLines.length - 1]]);
        setUndoneLines(undoneLines.slice(0, -1));
    };

    const handleClear = () => {
        setLines([]);
        setUndoneLines([]);
    };

    return (
        <div className="flex">
            {/* ToolBar 적용 */}
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
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
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
    );
};

export default Canvas;
