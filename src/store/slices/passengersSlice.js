/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import fieldNames from '../../components/PassengersSelection/PassengerCard/fieldNames';

const savedData = localStorage.getItem('passengers');
const empty = {
   passengers: [],
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const passengersSlice = createSlice({
   name: 'passengersSlice',
   initialState,
   reducers: {
      addNewPassenger(state, action) {
         state.passengers = [
            ...state.passengers.filter((pas) => pas.id !== action.payload.id),
            action.payload,
         ];
      },
      editPassengerData(state, action) {
         const ids = state.passengers.map((el) => el.id);
         const sameId = ids.indexOf(action.payload.id);

         if (sameId !== -1) {
            Object.keys(action.payload).forEach(
               // eslint-disable-next-line no-return-assign
               (key, ind) =>
                  (state.passengers[sameId][key] = Object.values(
                     action.payload
                  )[ind])
            );
         }
      },
      removeSeatInfo(state) {
         const deleteSeatInfo = (pas) => {
            delete pas[fieldNames.seatDep];
            delete pas[fieldNames.seatArr];
            delete pas[fieldNames.depOnly];
         };

         state.passengers.map((pas) => deleteSeatInfo(pas));
      },
      removeSeatInfoAfterUnchoosingSeat(state, action) {
         const { coachId, seatNumber } = action.payload;
         const seat = `${coachId}:${seatNumber}`;
         const deleteSeatInfo = (pas) => {
            if (pas[fieldNames.seatDep] === seat) {
               delete pas[fieldNames.seatDep];
               if (pas[fieldNames.depOnly]) {
                  delete pas[fieldNames.depOnly];
               }
            }
            if (pas[fieldNames.seatArr] === seat) {
               delete pas[fieldNames.seatArr];
            }
         };

         state.passengers.map((pas) => deleteSeatInfo(pas));
      },
      removePassenger(state, action) {
         state.passengers = state.passengers.filter(
            (item) => item.id !== action.payload
         );
      },
      removeAllPassengers() {
         return empty;
      },
   },
   extraReducers: {},
});

export const {
   addNewPassenger,
   editPassengerData,
   removePassenger,
   removeSeatInfo,
   removeSeatInfoAfterUnchoosingSeat,
   removeAllPassengers,
} = passengersSlice.actions;

export const selectPassengers = (state) => state.passengers.passengers;

export default passengersSlice;
