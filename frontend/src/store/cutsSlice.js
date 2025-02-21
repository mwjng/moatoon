import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authInstance } from '../api/axios';

export const fetchCutsInfo = createAsyncThunk('cuts/fetchCutsInfo', async (scheduleId, { rejectWithValue }) => {
    try {
        const response = await authInstance.get(`/cuts/info/${scheduleId}`);
        return response.data; // 서버에서 받은 데이터 반환
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const cutsSlice = createSlice({
    name: 'cuts',
    initialState: {
        cuts: [],
        loading: false,
        error: null,
    },
    reducers: {}, // 추가적인 reducer가 필요하면 여기에 작성
    extraReducers: builder => {
        builder
            .addCase(fetchCutsInfo.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCutsInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.cuts = action.payload; // 받아온 데이터를 상태에 저장
            })
            .addCase(fetchCutsInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cutsSlice.reducer;
