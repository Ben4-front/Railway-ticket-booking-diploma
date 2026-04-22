/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const savedData = localStorage.getItem('sort');
const empty = {
   limit: 5,
   sort: { label: 'времени', value: 'date' },
   offset: 0,
   currentPage: 1,
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const sortSlice = createSlice({
   name: 'sortSlice',
   initialState,
   reducers: {
      changeLimit(state, action) {
         state.limit = action.payload;
      },
      changeSort(state, action) {
         state.sort = action.payload;
      },
      changeOffset(state, action) {
         state.offset = action.payload;
      },
      setCurrentPage(state, action) {
         state.currentPage = action.payload;
      },
      removeSortData() {
         return empty;
      },
   },
   extraReducers: {},
});

export const {
   changeLimit,
   changeSort,
   changeOffset,
   setCurrentPage,
   removeSortData,
} = sortSlice.actions;

export const selectLimit = (state) => state.sort.limit;
export const selectSort = (state) => state.sort.sort;
export const selectOffset = (state) => state.sort.offset;
export const selectCurrentPage = (state) => state.sort.currentPage;

export default sortSlice;
