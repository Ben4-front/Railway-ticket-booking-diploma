import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscribe } from '../../api/service';

export const postSubscription = createAsyncThunk(
  'subscribe/postSubscription',
  async (email, { rejectWithValue }) => {
    try {
      const response = await subscribe(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  status: 'idle', // 'idle' | 'pending' | 'success' | 'error'
  message: '',
};

const subscribeSlice = createSlice({
  name: 'subscribe',
  initialState,
  reducers: {
    resetSubscription: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postSubscription.pending, (state) => {
        state.status = 'pending';
        state.message = '';
      })
      .addCase(postSubscription.fulfilled, (state, action) => {
        state.status = 'success';
        state.message = action.payload.status ? 'Вы успешно подписаны!' : 'Произошла ошибка.';
      })
      .addCase(postSubscription.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload || 'Не удалось отправить запрос.';
      });
  },
});

export const { resetSubscription } = subscribeSlice.actions;
export default subscribeSlice.reducer;