/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import fieldNames from '../../components/PaymentOptions/fieldNames';

const savedData = localStorage.getItem('personalData');
const empty = {
   [fieldNames.lastName]: null,
   [fieldNames.firstName]: null,
   [fieldNames.fathersName]: null,
   [fieldNames.phone]: null,
   [fieldNames.email]: null,
   [fieldNames.paymentMethod]: null,
};
const initialState = savedData ? JSON.parse(savedData) : empty;

const personalDataSlice = createSlice({
   name: 'personalDataSlice',
   initialState,
   reducers: {
      addPersonalData(state, action) {
         const {
            lastName,
            firstName,
            fathersName,
            phone,
            email,
            paymentMethod,
         } = action.payload;

         state[fieldNames.lastName] = lastName;
         state[fieldNames.firstName] = firstName;
         state[fieldNames.fathersName] = fathersName;
         state[fieldNames.phone] = phone;
         state[fieldNames.email] = email;
         state[fieldNames.paymentMethod] = paymentMethod;
      },
      removePersonalData() {
         return empty;
      },
   },
   extraReducers: {},
});

export const { addPersonalData, removePersonalData } =
   personalDataSlice.actions;

export const selectPersonalData = (state) => state.personalData;

export default personalDataSlice;
