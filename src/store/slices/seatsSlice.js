/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { fetchSeats } from '../thunks/asyncThunks';

const savedData = localStorage.getItem('seats');
const empty = {
   seatsOptions: { departure: [], arrival: [] },
   loading: false,
   error: null,
   selectedSeats: {
      departure: [],
      arrival: [],
   },
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const seatsSlice = createSlice({
   name: 'seatsSlice',
   initialState,
   reducers: {
      addSelectedSeats(state, action) {
         const {
            number,
            direction,
            coachId,
            coachName,
            price,
            priceCoefficient,
         } = action.payload;
         const ids = state.selectedSeats[direction].map((el) => el.coachId);
         const sameId = ids.indexOf(coachId);

         if (sameId !== -1) {
            state.selectedSeats[direction][sameId].seats = [
               ...state.selectedSeats[direction][sameId].seats,
               { seat: number, price, priceCoefficient, passengerId: null },
            ];
         } else {
            state.selectedSeats[direction] = [
               ...state.selectedSeats[direction],
               {
                  coachId,
                  coachName,
                  seats: [
                     {
                        seat: number,
                        price,
                        priceCoefficient,
                        passengerId: null,
                     },
                  ],
               },
            ];
         }
      },
      addPassengerId(state, action) {
         const { seat, direction, coachId, passengerId } = action.payload;

         const ids = state.selectedSeats[direction].map((el) => el.coachId);
         const sameId = ids.indexOf(coachId);

         if (sameId !== -1) {
            const allSeats = state.selectedSeats[direction][sameId].seats.map(
               (el) => el.seat
            );

            state.selectedSeats[direction][sameId].seats[
               allSeats.indexOf(seat)
            ].passengerId = passengerId;
         }
      },
      removeSelectedSeat(state, action) {
         const { number, direction, coachId } = action.payload;
         state.selectedSeats[direction].forEach((el) => {
            if (el.coachId === coachId) {
               el.seats = el.seats.filter((item) => item.seat !== number);
            }
         });
      },
      removeAllSelectedSeatsFromCoach(state, action) {
         const { direction, coachId } = action.payload;
         state.selectedSeats[direction] = state.selectedSeats[direction].filter(
            (el) => el.coachId !== coachId
         );
      },

      removeSeatsData() {
         return empty;
      },
   },
   extraReducers: {
      [fetchSeats.pending]: (state) => {
         state.loading = true;
         state.error = null;
      },
      [fetchSeats.fulfilled]: (state, action) => {
         state.loading = false;
         state.error = null;
         const { data, direction } = action.payload;
         state.seatsOptions[direction] = data;
      },
      [fetchSeats.rejected]: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },
   },
});

export const {
   addSelectedSeats,
   removeSelectedSeat,
   removeAllSelectedSeatsFromCoach,
   removeSeatsData,
   addPassengerId,
} = seatsSlice.actions;

export const selectSeatsOptions = (state) => state.seats.seatsOptions;
export const selectSelectedSeats = (state) => state.seats.selectedSeats;
export const selectLoading = (state) => state.seats.loading;
export const selectError = (state) => state.seats.error;

export default seatsSlice;
