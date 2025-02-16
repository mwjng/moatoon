import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    lines: [],
    undoneLines: [],
};

const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setLines: (state, action) => {
            state.lines = action.payload;
        },
        setUndoneLines: (state, action) => {
            state.undoneLines = action.payload;
        },
        addLine: (state, action) => {
            state.lines.push(action.payload);
        },
        undoLine: state => {
            if (state.lines.length > 0) {
                const lastLine = state.lines[state.lines.length - 1];
                state.lines.pop();
                state.undoneLines.push(lastLine);
            }
        },
        redoLine: state => {
            if (state.undoneLines.length > 0) {
                const lastUndoneLine = state.undoneLines[state.undoneLines.length - 1];
                state.undoneLines.pop();
                state.lines.push(lastUndoneLine);
            }
        },
        clearCanvas: state => {
            state.lines = [];
            state.undoneLines = [];
        },
    },
});

export const { setLines, setUndoneLines, addLine, undoLine, redoLine, clearCanvas } = canvasSlice.actions;

export default canvasSlice.reducer;
