import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  passengers: [{
    id: 1, 
    isAdult: true,
    firstName: '',
    lastName: '',
    patronymic: '',
    gender: 'male',
    birthday: '',
    documentType: 'passport',
    documentSeries: '',
    documentNumber: '',
    isChild: false,
  }],
  user: {
    lastName: '',
    firstName: '',
    patronymic: '',
    phone: '',
    email: '',
    paymentMethod: 'online', // Устанавливаем 'online' как значение по умолчанию
  },
  error: null,
};

const passengersSlice = createSlice({
  name: 'passengers',
  initialState,
  reducers: {
    addPassenger: (state) => {
      if (state.passengers.length < 5) {
        state.passengers.push({ ...initialState.passengers[0], id: Date.now() });
      }
    },
    removePassenger: (state, action) => {
      state.passengers = state.passengers.filter(p => p.id !== action.payload);
    },
    updatePassenger: (state, action) => {
      const { id, field, value } = action.payload;
      const passenger = state.passengers.find(p => p.id === id);
      if (passenger) {
        passenger[field] = value;
      }
    },
    setPassengersData: (state, action) => {
        state.passengers = action.payload;
    },
    setUserData: (state, action) => {
        state.user = { ...state.user, ...action.payload };
    },
    resetPassengers: () => initialState,
  },
});

export const { 
    addPassenger, 
    removePassenger, 
    updatePassenger, 
    setPassengersData,
    setUserData,
    resetPassengers 
} = passengersSlice.actions;

export default passengersSlice.reducer;