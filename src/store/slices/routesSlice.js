import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRoutes } from './searchSlice.js' 

/**
 * Thunk для асинхронного получения маршрутов с сервера.
 */
export const getRoutes = createAsyncThunk(
  'routes/getRoutes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchRoutes(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Начальное состояние
const initialState = {
  routes: [],
  total_count: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  
  // Параметры фильтрации
  filters: {
    have_first_class: false,
    have_second_class: false,
    have_third_class: false,
    have_fourth_class: false,
    have_wifi: false,
    have_air_conditioning: false,
    have_express: false,
    price_from: 0,
    price_to: 20000, // Устанавливаем разумный максимум по умолчанию
    start_departure_hour_from: 0,
    start_departure_hour_to: 24,
    start_arrival_hour_from: 0,
    start_arrival_hour_to: 24,
    end_departure_hour_from: 0,
    end_departure_hour_to: 24,
    end_arrival_hour_from: 0,
    end_arrival_hour_to: 24,
  },
  
  // Параметры сортировки и пагинации
  sort: 'date',
  limit: 5,
  offset: 0,
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    /**
     * Устанавливает тип сортировки.
     */
    setSort: (state, action) => {
      state.sort = action.payload;
      state.offset = 0; // Сбрасываем пагинацию при смене сортировки
    },

    /**
     * Устанавливает лимит элементов на странице.
     */
    setLimit: (state, action) => {
      state.limit = action.payload;
    },

    /**
     * Устанавливает смещение (для пагинации).
     */
    setOffset: (state, action) => {
      state.offset = action.payload;
    },

    /**
     * Устанавливает значение для одного из фильтров.
     */
    setFilter: (state, action) => {
      const { name, value } = action.payload;
      state.filters[name] = value;
      state.offset = 0; // Сбрасываем пагинацию при смене фильтра
    },
    
    /**
     * Сбрасывает все фильтры к значениям по умолчанию.
     */
    resetFilters: (state) => {
        state.filters = initialState.filters;
    },

    /**
     * Сбрасывает все состояние среза к начальному.
     */
    resetRoutes: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoutes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getRoutes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.routes = action.payload.items || [];
        state.total_count = action.payload.total_count || 0;
      })
      .addCase(getRoutes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.routes = [];
        state.total_count = 0;
      });
  },
});

export const { setSort, setLimit, setOffset, setFilter, resetFilters, resetRoutes } = routesSlice.actions;

export default routesSlice.reducer;