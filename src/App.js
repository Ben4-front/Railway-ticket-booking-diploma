import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';

import MainPage from './pages/MainPage/MainPage';
import TrainSelectionPage from './pages/TrainSelectionPage/TrainSelectionPage';
import SeatSelectionPage from './pages/SeatsSelectionPage/SeatSelectionPage';
import PassengersPage from './pages/PassengersPage/PassengersPage';
import PaymentOptionsPage from './pages/PaymentOptionsPage/PaymentOptionsPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage/OrderConfirmationPage';
import SuccessfulOrderPage from './pages/SuccessfulOrderPage/SuccessfulOrderPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';

import links from './data/links';

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path={links.main} element={<MainPage />} />
            <Route path={links.trains} element={<TrainSelectionPage />} />
            <Route path={links.seats} element={<SeatSelectionPage />} />
            <Route path={links.passengers} element={<PassengersPage />} />
            <Route
               path={links.paymentOptions}
               element={<PaymentOptionsPage />}
            />
            <Route
               path={links.confirmOrder}
               element={<OrderConfirmationPage />}
            />
            <Route path={links.success} element={<SuccessfulOrderPage />} />
            <Route path="*" element={<ErrorPage />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
