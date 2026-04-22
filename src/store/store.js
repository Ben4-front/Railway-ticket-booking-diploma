import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
   persistStore,
   persistReducer,
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import searchSlice from './slices/searchSlice';
import sidebarSelectSlice from './slices/sidebarSelectSlice';
import trainsSlice from './slices/trainsSlice';
import sortSlice from './slices/sortSlice';
import trainSlice from './slices/trainSlice';
import seatsSlice from './slices/seatsSlice';
import numOfpassengersSlice from './slices/numOfpassengersSlice';
import passengersSlice from './slices/passengersSlice';
import personalDataSlice from './slices/personalDataSlice';
import orderConfirmationSlice from './slices/orderConfirmationSlice';
import lastTicketsSlice from './slices/lastTicketsSlice';
import orderSlice from './slices/orderSlice';

const persistConfig = {
   key: 'storage',
   storage,
   blacklist: ['orderConfirmation', 'lastTickets'],
};

const searchPersistConfig = {
   key: 'search',
   storage,
};

const sidebarSelectPersistConfig = {
   key: 'sidebarSelect',
   storage,
};

const trainsPersistConfig = {
   key: 'trains',
   storage,
   blacklist: ['loading', 'error'],
};

const sortPersistConfig = {
   key: 'sort',
   storage,
};

const trainPersistConfig = {
   key: 'train',
   storage,
};

const seatsPersistConfig = {
   key: 'seats',
   storage,
   blacklist: ['loading', 'error'],
};

const numOfPassengersPersistConfig = {
   key: 'numOfPassengers',
   storage,
};

const passengersPersistConfig = {
   key: 'passengers',
   storage,
};

const personalDataPersistConfig = {
   key: 'personalData',
   storage,
};

const orderConfig = {
   key: 'order',
   storage,
};

const reducer = combineReducers({
   search: persistReducer(searchPersistConfig, searchSlice.reducer),
   sidebarSelect: persistReducer(
      sidebarSelectPersistConfig,
      sidebarSelectSlice.reducer
   ),
   trains: persistReducer(trainsPersistConfig, trainsSlice.reducer),
   sort: persistReducer(sortPersistConfig, sortSlice.reducer),
   train: persistReducer(trainPersistConfig, trainSlice.reducer),
   seats: persistReducer(seatsPersistConfig, seatsSlice.reducer),
   numOfPassengers: persistReducer(
      numOfPassengersPersistConfig,
      numOfpassengersSlice.reducer
   ),
   passengers: persistReducer(passengersPersistConfig, passengersSlice.reducer),
   personalData: persistReducer(
      personalDataPersistConfig,
      personalDataSlice.reducer
   ),
   order: persistReducer(orderConfig, orderSlice.reducer),
   orderConfirmation: orderConfirmationSlice.reducer,
   lastTickets: lastTicketsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         },
      }),
});

export const persistor = persistStore(store);
export default store;
