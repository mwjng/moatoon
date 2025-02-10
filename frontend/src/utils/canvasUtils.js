export const updateLines = (prevLines, data) => {
    switch (data.type) {
        case 'UNDO':
            return prevLines.slice(0, -1); // Undo 처리
        case 'REDO':
            return data.redoLine ? [...prevLines, data.redoLine] : prevLines; // Redo 처리
        case 'draw': // draw 타입 처리
            return handleDraw(prevLines, data.line);
        default:
            return prevLines;
    }
};

const handleDraw = (prevLines, line) => {
    if (!line || !line.points || line.points.length === 0) return prevLines; // 선의 점이 없는 경우 방어

    const lastLine = prevLines[prevLines.length - 1];
    if (lastLine && lastLine.points[0] === line.points[0] && lastLine.points[1] === line.points[1]) {
        // 마지막 선을 업데이트
        const updatedLines = [...prevLines];
        updatedLines[updatedLines.length - 1] = { ...lastLine, points: line.points };
        return updatedLines;
    }

    // 새로운 선 추가
    return [...prevLines, line];
};
