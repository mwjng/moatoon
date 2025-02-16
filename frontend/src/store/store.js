import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cutsReducer from './cutsSlice';
import canvasReducer from './canvasSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        cuts: cutsReducer,
        canvas: canvasReducer,
    },
});

export default store;
