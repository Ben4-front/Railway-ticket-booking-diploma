/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const savedData = localStorage.getItem('sidebarSelect');
const empty = {
   options: {
      firstClass: '',
      secondClass: '',
      thirdClass: '',
      fourthClass: '',
      wifi: '',
      express: '',
   },
   prices: { min: 0, max: null },
   time: {
      to: {
         departure: { min: 0, max: 24 * 60 },
         arrival: { min: 0, max: 24 * 60 },
         expanded: false,
      },
      back: {
         departure: { min: 0, max: 24 * 60 },
         arrival: { min: 0, max: 24 * 60 },
         expanded: false,
      },
   },
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const sidebarSelectSlice = createSlice({
   name: 'sidebarSelectSlice',
   initialState,
   reducers: {
      changeOptionsFields(state, action) {
         const { name, value } = action.payload;
         state.options[name] = value;
      },
      changePriceFields(state, action) {
         state.prices.min = action.payload[0];
         state.prices.max = action.payload[1];
      },
      changeTimeFields(state, action) {
         const { name, direction, value } = action.payload;
         state.time[name][direction] = { min: value[0], max: value[1] };
      },
      setExpanded(state, action) {
         const { name } = action.payload;
         state.time[name].expanded = !state.time[name].expanded;
      },
      removeSidebarSelectionData() {
         return empty;
      },
   },
   extraReducers: {},
});

export const {
   changeOptionsFields,
   changePriceFields,
   changeTimeFields,
   removeSidebarSelectionData,
   setExpanded,
} = sidebarSelectSlice.actions;

export const selectOptions = (state) => state.sidebarSelect.options;
export const selectPrices = (state) => state.sidebarSelect.prices;
export const selectTime = (state) => state.sidebarSelect.time;

export default sidebarSelectSlice;
