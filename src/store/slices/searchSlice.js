import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCities } from '../../api/service';
import dayjs from 'dayjs';

/**
 * Thunk для асинхронного получения списка городов.
 * Использует `rejectWithValue` для корректной обработки ошибок.
 */
export const getCities = createAsyncThunk(
  'search/getCities',
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetchCities(name);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Начальное состояние для среза
const initialState = {
  from: { id: null, name: '' },
  to: { id: null, name: '' },
  date_start: dayjs().format('YYYY-MM-DD'), // По умолчанию сегодняшняя дата
  date_end: null,
  
  // Состояние для автодополнения городов
  cities: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    // Указывает, для какого инпута ('from' или 'to') сейчас загружаются города
    loadingFor: null,
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /**
     * Устанавливает значение для простого поля в состоянии (например, даты).
     * @param {object} state - Текущее состояние.
     * @param {object} action - Экшен с payload: { field: string, value: any }
     */
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    /**
     * Устанавливает город отправления или прибытия.
     * @param {object} state - Текущее состояние.
     * @param {object} action - Экшен с payload: { direction: 'from' | 'to', city: object }
     */
    setPoint: (state, action) => {
      const { direction, city } = action.payload;
      state[direction] = city;
      state.cities.items = []; // Очищаем список подсказок после выбора
    },

    /**
     * Меняет местами города отправления и прибытия.
     */
    swapPoints: (state) => {
      [state.from, state.to] = [state.to, state.from];
    },

    /**
     * Очищает список подсказок городов.
     */
    clearCities: (state) => {
      state.cities.items = [];
      state.cities.status = 'idle';
      state.cities.error = null;
    },

    /**
     * Полностью сбрасывает состояние формы поиска.
     */
    resetSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCities.pending, (state, action) => {
        state.cities.status = 'loading';
        state.cities.loadingFor = action.meta.arg.direction; // Сохраняем, для какого поля идет загрузка
        state.cities.error = null;
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.cities.status = 'succeeded';
        state.cities.items = action.payload;
      })
      .addCase(getCities.rejected, (state, action) => {
        state.cities.status = 'failed';
        state.cities.error = action.payload; // Ошибка из rejectWithValue
        state.cities.items = [];
      });
  },
});

export const { setField, setPoint, swapPoints, clearCities, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;