/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { fetchLastTickets } from '../thunks/asyncThunks';

const initialState = {
   lastTickets: null,
   loading: false,
   error: null,
};

const lastTicketsSlice = createSlice({
   name: 'lastTicketsSlice',
   initialState,
   reducers: {
      removeLastTicketsData() {
         return initialState;
      },
   },
   extraReducers: {
      [fetchLastTickets.pending]: (state) => {
         state.loading = true;
         state.error = null;
      },
      [fetchLastTickets.fulfilled]: (state, action) => {
         state.loading = false;
         state.error = null;
         state.lastTickets = action.payload.map((ticket, index) => ({
            id: index,
            price: ticket.departure.min_price,
            from: {
               city: ticket.departure.from.city.name,
               station: ticket.departure.from.railway_station_name,
            },
            to: {
               city: ticket.departure.to.city.name,
               station: ticket.departure.to.railway_station_name,
            },
            icons: {
               wifi: ticket.departure.have_wifi,
               conditioner: ticket.departure.have_air_conditioning,
               express: ticket.departure.is_express,
            },
         }));
      },
      [fetchLastTickets.rejected]: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },
   },
});

export const { removeLastTicketsData } = lastTicketsSlice.actions;

export const selectLastTickets = (state) => state.lastTickets.lastTickets;
export const selectLoading = (state) => state.lastTickets.loading;
export const selectError = (state) => state.lastTickets.error;

export default lastTicketsSlice;
