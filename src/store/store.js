import { configureStore } from '@reduxjs/toolkit';
import searchSlice from './slices/searchSlice';
import routesSlice from './slices/routesSlice';
import seatsSlice from './slices/seatsSlice';
import orderSlice from './slices/orderSlice';
import subscribeSlice from './slices/subscribeSlice';
import passengersSlice from './slices/passengersSlice';

export const store = configureStore({
  reducer: {
    search: searchSlice,
    routes: routesSlice,
    seats: seatsSlice,
    order: orderSlice,
    subscribe: subscribeSlice,
    passengers: passengersSlice,
  },
});