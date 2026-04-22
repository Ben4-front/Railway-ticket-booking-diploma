/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const savedData = localStorage.getItem('search');
const empty = {
   departureCity: '',
   arrivalCity: '',
   departureDate: '',
   returnDate: '',
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const searchSlice = createSlice({
   name: 'searchSlice',
   initialState,
   reducers: {
      changeSearchFields(state, action) {
         const { name, value } = action.payload;
         state[name] = value;
      },
      swapValues(state) {
         const departure = state.departureCity;
         state.departureCity = state.arrivalCity;
         state.arrivalCity = departure;
      },
      removeSearchData() {
         return empty;
      },
   },
   extraReducers: {},
});

export const { changeSearchFields, swapValues, removeSearchData } =
   searchSlice.actions;

export const selectDepartureCity = (state) => state.search.departureCity;
export const selectArrivalCity = (state) => state.search.arrivalCity;
export const selectDepartureDate = (state) => state.search.departureDate;
export const selectReturnDate = (state) => state.search.returnDate;

export default searchSlice;
