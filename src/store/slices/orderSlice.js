import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postOrder } from './searchSlice'
import { fetchRoutes } from './searchSlice.js'

export const submitOrder = createAsyncThunk(
  'order/submitOrder',
  async (_, { getState }) => {
    const { seats, passengers } = getState();
    const { departure, arrival } = seats.selectedSeats;

    const formatSeat = (seat, index) => {
      const passenger = passengers.passengers[index];
      return {
        coach_id: seat.coach_id,
        seat_number: seat.seat_number,
        is_child: !passenger.isAdult,
        include_children_seat: false, // Логика для этого не описана в ТЗ
        person_info: {
          is_adult: passenger.isAdult,
          first_name: passenger.firstName,
          last_name: passenger.lastName,
          patronymic: passenger.patronymic,
          gender: passenger.gender === 'male',
          birthday: passenger.birthday,
          document_type: passenger.documentType === 'passport' ? 'паспорт' : 'свидетельство о рождении',
          document_data: `${passenger.documentSeries || ''}${passenger.documentNumber}`,
        },
      };
    };

    const orderData = {
      user: { ...passengers.user, payment_method: passengers.user.paymentMethod },
      departure: {
        route_direction_id: seats.departureRouteId,
        seats: departure.map(formatSeat),
      },
    };

    if (seats.arrivalRouteId) {
      orderData.arrival = {
        route_direction_id: seats.arrivalRouteId,
        seats: arrival.map(formatSeat),
      };
    }
    
    const response = await postOrder(orderData);
    return response;
  }
);

const initialState = {
  status: 'idle', // 'idle' | 'pending' | 'success' | 'error'
  error: null,
  orderResult: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status = 'success';
        state.orderResult = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;