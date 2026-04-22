import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSeats } from '../../api/service';

/**
 * Thunk для получения данных о местах для одного маршрута (туда или обратно).
 */
export const getSeats = createAsyncThunk(
  'seats/getSeats',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await fetchSeats(id, params);
      return { id, data: response }; // Возвращаем и id, и данные, чтобы знать, куда их положить
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Вспомогательная функция для пересчета общей стоимости
const recalculateTotalPrice = (state) => {
    let total = 0;
    const processSeats = (seats) => {
        seats.forEach(seat => {
            // Цена самого места (верхнее/нижнее)
            total += seat.price;
            // Цена доп. услуг (бельё, кондиционер)
            if (seat.services) {
                Object.values(seat.services).forEach(service => {
                    if (service.is_included) total += service.price;
                });
            }
        });
    };
    processSeats(state.selectedSeats.departure);
    processSeats(state.selectedSeats.arrival);
    state.totalPrice = total;
};

const initialState = {
  departureRoute: null, // Полные данные о маршруте "туда"
  arrivalRoute: null,   // Полные данные о маршруте "обратно"
  
  departureSeatsData: [], // Данные о местах в вагонах "туда"
  arrivalSeatsData: [],   // Данные о местах в вагонах "обратно"

  departureRouteId: null, // ID маршрута "туда" для API запроса
  arrivalRouteId: null,   // ID маршрута "обратно" для API запроса

  // Объект с выбранными местами
  selectedSeats: {
    departure: [], // [{ coach_id, seat_number, price, services: { wifi: { price, is_included } } }]
    arrival: [],
  },

  totalPrice: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const seatsSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    /**
     * Сохраняет данные о выбранных маршрутах перед запросом мест.
     */
    setRoutesForSelection: (state, action) => {
      const { departure, arrival } = action.payload;
      state.departureRoute = departure;
      state.arrivalRoute = arrival;
      state.departureRouteId = departure?._id;
      state.arrivalRouteId = arrival?._id;
    },

    /**
     * Добавляет или удаляет место из списка выбранных.
     */
    toggleSeat: (state, action) => {
      const { direction, seatInfo } = action.payload; // direction: 'departure' | 'arrival'
      const { coach_id, seat_number } = seatInfo;
      const seatsList = state.selectedSeats[direction];
      const seatIndex = seatsList.findIndex(
        s => s.coach_id === coach_id && s.seat_number === seat_number
      );

      if (seatIndex !== -1) {
        // Место уже выбрано, удаляем его
        seatsList.splice(seatIndex, 1);
      } else {
        // Место не выбрано, добавляем. Инициализируем услуги как невыбранные
        const services = {
            wifi: { price: seatInfo.wifi_price || 0, is_included: false },
            linens: { price: seatInfo.linens_price || 0, is_included: false },
        };
        // Если белье включено по умолчанию, отмечаем это
        if (seatInfo.is_linens_included) {
            services.linens.is_included = true;
        }

        seatsList.push({ ...seatInfo, services });
      }
      
      recalculateTotalPrice(state);
    },

    /**
     * Включает или выключает дополнительную услугу для выбранного места.
     */
    toggleService: (state, action) => {
        const { direction, coach_id, seat_number, serviceName } = action.payload;
        const seat = state.selectedSeats[direction].find(
            s => s.coach_id === coach_id && s.seat_number === seat_number
        );
        if (seat && seat.services[serviceName]) {
            seat.services[serviceName].is_included = !seat.services[serviceName].is_included;
        }
        recalculateTotalPrice(state);
    },
    
    /**
     * Сбрасывает состояние среза к начальному.
     */
    resetSeats: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSeats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getSeats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, data } = action.payload;
        // Кладём данные в соответствующий массив (туда или обратно)
        if (id === state.departureRouteId) {
          state.departureSeatsData = data;
        }
        if (id === state.arrivalRouteId) {
          state.arrivalSeatsData = data;
        }
      })
      .addCase(getSeats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setRoutesForSelection, toggleSeat, toggleService, resetSeats } = seatsSlice.actions;

export default seatsSlice.reducer;