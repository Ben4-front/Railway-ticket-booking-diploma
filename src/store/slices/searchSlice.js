import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

// ====================================================================
// НАЧАЛО ВСТАВЛЕННОГО КОДА ИЗ SERVICE.JS
// Весь код для работы с API теперь находится здесь.
// ====================================================================

const API_BASE_URL = 'https://students.netoservices.ru/fe-diplom';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `Request failed with status ${response.status}` 
      }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

/**
 * Запрос на получение списка городов по части названия.
 * Экспортируется, чтобы быть доступной для других срезов.
 */
export const fetchCities = (name) => request(`/routes/cities?name=${name}`);

/**
 * Запрос на получение списка маршрутов.
 * Экспортируется, чтобы быть доступной для routesSlice.
 */
export const fetchRoutes = (params) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== '' && value !== false)
  );
  const queryString = new URLSearchParams(filteredParams).toString();
  return request(`/routes?${queryString}`);
};

/**
 * Запрос на получение информации о местах.
 * Экспортируется, чтобы быть доступной для seatsSlice.
 */
export const fetchSeats = (id, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/routes/${id}/seats` + (queryString ? `?${queryString}` : '');
  return request(endpoint);
};

/**
 * Отправка данных заказа на сервер.
 * Экспортируется, чтобы быть доступной для orderSlice.
 */
export const postOrder = (data) => request('/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

/**
 * Отправка email для подписки.
 * Экспортируется, чтобы быть доступной для subscribeSlice.
 */
export const subscribe = (email) => {
  const endpoint = `/subscribe?email=${encodeURIComponent(email)}`;
  return request(endpoint, {
    method: 'POST',
  });
};

// ====================================================================
// КОНЕЦ ВСТАВЛЕННОГО КОДА
// ====================================================================


/**
 * Thunk для асинхронного получения списка городов.
 * Использует функцию `fetchCities`, определенную выше в этом же файле.
 */
export const getCities = createAsyncThunk(
  'search/getCities',
  // thunk принимает объект, например { name: 'мо', direction: 'from' }
  async (params, { rejectWithValue }) => { 
    try {
      // В fetchCities нужно передать только имя, а не весь объект
      const response = await fetchCities(params.name); 
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Начальное состояние для среза поиска
const initialState = {
  from: { id: null, name: '' },
  to: { id: null, name: '' },
  date_start: dayjs().format('YYYY-MM-DD'),
  date_end: null,
  
  cities: {
    items: [],
    status: 'idle',
    error: null,
    loadingFor: null,
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setPoint: (state, action) => {
      const { direction, city } = action.payload;
      state[direction] = city;
      state.cities.items = [];
    },
    swapPoints: (state) => {
      [state.from, state.to] = [state.to, state.from];
    },
    clearCities: (state) => {
      state.cities.items = [];
      state.cities.status = 'idle';
      state.cities.error = null;
    },
    resetSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCities.pending, (state, action) => {
        state.cities.status = 'loading';
        state.cities.loadingFor = action.meta.arg.direction;
        state.cities.error = null;
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.cities.status = 'succeeded';
        state.cities.items = action.payload;
      })
      .addCase(getCities.rejected, (state, action) => {
        state.cities.status = 'failed';
        state.cities.error = action.payload;
        state.cities.items = [];
      });
  },
});

export const { setField, setPoint, swapPoints, clearCities, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;