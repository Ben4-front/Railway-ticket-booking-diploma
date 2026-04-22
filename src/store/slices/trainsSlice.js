/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { fetchTrainsOptions } from '../thunks/asyncThunks';

const savedData = localStorage.getItem('trains');
const empty = {
   totalCount: 0,
   trainsOptions: [],
   loading: false,
   error: null,
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const trainsSlice = createSlice({
   name: 'trainsSlice',
   initialState,
   reducers: {
      removeTrainsData() {
         return empty;
      },
   },
   extraReducers: {
      [fetchTrainsOptions.pending]: (state) => {
         state.loading = true;
         state.error = null;
      },
      [fetchTrainsOptions.fulfilled]: (state, action) => {
         state.loading = false;
         state.error = null;
         state.totalCount = action.payload.total_count;
         state.trainsOptions = action.payload.items?.map((ticket, index) => ({
            id: index,
            ticket,
         }));
      },
      [fetchTrainsOptions.rejected]: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },
   },
});

export const { removeTrainsData } = trainsSlice.actions;

export const selectTotalCount = (state) => state.trains.totalCount;
export const selectTrainsOptions = (state) => state.trains.trainsOptions;
export const selectLoading = (state) => state.trains.loading;
export const selectError = (state) => state.trains.error;

export default trainsSlice;
