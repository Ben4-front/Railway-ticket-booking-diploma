import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLastTickets = createAsyncThunk(
   'trains/fetchLastTickets',
   async (url, { rejectWithValue }) => {
      try {
         const response = await fetch(url);
         if (!response.ok) {
            throw new Error();
         }
         const data = await response.json();
         return data;
      } catch (err) {
         return rejectWithValue('Данные о поездах не загрузились');
      }
   }
);

export const fetchTrainsOptions = createAsyncThunk(
   'trains/fetchTrainsOptions',
   async (url, { rejectWithValue }) => {
      try {
         const response = await fetch(url);
         if (!response.ok) {
            throw new Error();
         }
         const data = await response.json();
         return data;
      } catch (err) {
         return rejectWithValue('Данные о поездах не загрузились');
      }
   }
);

export const fetchSeats = createAsyncThunk(
   'seats/fetchSeats',
   async ({ url, direction }, { rejectWithValue }) => {
      try {
         const response = await fetch(url);

         if (!response.ok) {
            throw new Error();
         }
         const data = await response.json();

         return { data, direction };
      } catch (err) {
         return rejectWithValue('Данные о наличии мест не загрузились');
      }
   }
);

export const postOrder = createAsyncThunk(
   'orderConfirmation/postOrder',
   async ({ url, request }, { rejectWithValue }) => {
      try {
         const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
         });

         if (!response.ok) {
            throw new Error();
         }
         const data = await response.json();
         return data;
      } catch (err) {
         return rejectWithValue(
            'При отправке заказа возникла проблема. Пожалуйста, повторите попытку или вернитесь на главную страницу'
         );
      }
   }
);
