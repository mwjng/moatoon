import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cutsReducer from './cutsSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        cuts: cutsReducer,
    },
});

export default store;
