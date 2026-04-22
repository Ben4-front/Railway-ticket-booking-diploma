/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const savedData = localStorage.getItem('order');
const empty = {
   orderNumber: null,
   sum: null,
   name: null,
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const orderSlice = createSlice({
   name: 'orderSlice',
   initialState,
   reducers: {
      addOrderData(state, action) {
         const { orderNumber, sum, name } = action.payload;
         state.orderNumber = orderNumber;
         state.sum = sum;
         state.name = name;
      },
      removeOrderData() {
         return empty;
      },
   },
   extraReducers: {},
});

export const { addOrderData, removeOrderData } = orderSlice.actions;

export const selectOrderNumber = (state) => state.order.orderNumber;
export const selectSum = (state) => state.order.sum;
export const selectName = (state) => state.order.name;

export default orderSlice;
