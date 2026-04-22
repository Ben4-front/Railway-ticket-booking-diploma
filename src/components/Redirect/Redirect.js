import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { selectIndex } from '../../store/slices/trainSlice';
import { selectSelectedSeats } from '../../store/slices/seatsSlice';
import { selectPassengers } from '../../store/slices/passengersSlice';
import { selectPersonalData } from '../../store/slices/personalDataSlice';
import {
   selectOrderNumber,
   selectName,
   selectSum,
} from '../../store/slices/orderSlice';

import fieldNames from '../PaymentOptions/fieldNames';
import directions from '../../data/directions';
import links from '../../data/links';

import styles from './Redirect.module.scss';

function Redirect({ reason }) {
   const navigate = useNavigate();
   const { pathname } = useLocation();

   const selectedTrainIndex = useSelector(selectIndex);
   const seatsDep = useSelector(selectSelectedSeats)[directions.departure];
   const seatsArr = useSelector(selectSelectedSeats)[directions.arrival];
   const passengers = useSelector(selectPassengers);
   const paymentOption =
      useSelector(selectPersonalData)[fieldNames.paymentMethod];
   const orderNumber = useSelector(selectOrderNumber);
   const sum = useSelector(selectSum);
   const name = useSelector(selectName);
   const unchosenSeats = [...seatsDep, ...seatsArr]
      .map((el) => el.seats)
      .flat()
      .filter((item) => !item.passengerId);

   const title = useRef(document.createElement('section'));
   useEffect(() => {
      title.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
   }, []);

   const redirectMaker = (mainText, btnText, link) => (
      <section ref={title} className={styles.redirect}>
         <h2 className={styles.text}>{mainText}</h2>
         <div className={styles.buttonWrapper}>
            <button onClick={() => navigate(link)} type="button">
               {btnText}
            </button>
         </div>
      </section>
   );

   const redirecttoMain = redirectMaker(
      'Пожалуйста, для последующих действий выберите направление и дату поездки',
      'На главную',
      links.main
   );

   const redirectToSeatsSelection = redirectMaker(
      'Для последующих действий нужно выбрать места',
      'Выбрать места',
      links.seats
   );

   const redirectToPassengersSelection = redirectMaker(
      'Для последующих действий нужно ввести данные всех пассажиров',
      'Выбрать пассажиров',
      links.passengers
   );

   const redirectToPaymentOptions = redirectMaker(
      'Для подтверждения заказа сначала выберите способ оплаты',
      'Выбрать способ оплаты',
      links.paymentOptions
   );

   const redirectToConfirmationPage = redirectMaker(
      'Вы не подтвердили заказ. Пожалуйста, вернитесь на предыдущую страницу и внесите изменения или подтвердите заказ',
      'На страницу подтверждения заказа',
      links.confirmOrder
   );

   const redirectToMainFromSuccess = redirectMaker(
      'Пожалуйста, для последующих действий перейдите на главную',
      'На главную',
      links.main
   );

   const redirectError = redirectMaker(
      'Извините, такая страница не найдена',
      'На главную',
      links.main
   );

   return (
      <>
         {selectedTrainIndex === null &&
            !reason &&
            pathname !== links.success &&
            redirecttoMain}
         {seatsDep.length <= 0 &&
            !reason &&
            seatsArr.length <= 0 &&
            selectedTrainIndex !== null &&
            (pathname === links.confirmOrder ||
               pathname === links.paymentOptions ||
               pathname === links.passengers ||
               pathname === links.success) &&
            redirectToSeatsSelection}
         {(seatsDep.length > 0 || seatsArr.length > 0) &&
            !reason &&
            selectedTrainIndex !== null &&
            unchosenSeats.length > 0 &&
            (pathname === links.confirmOrder ||
               pathname === links.paymentOptions ||
               pathname === links.success) &&
            redirectToPassengersSelection}
         {(seatsDep.length > 0 || seatsArr.length > 0) &&
            !reason &&
            selectedTrainIndex !== null &&
            passengers.length > 0 &&
            !paymentOption &&
            (pathname === links.confirmOrder || pathname === links.success) &&
            redirectToPaymentOptions}
         {(seatsDep.length > 0 || seatsArr.length > 0) &&
            !reason &&
            selectedTrainIndex !== null &&
            passengers.length > 0 &&
            paymentOption &&
            pathname === links.success &&
            redirectToConfirmationPage}
         {seatsDep.length <= 0 &&
            !reason &&
            seatsArr.length <= 0 &&
            selectedTrainIndex === null &&
            passengers.length <= 0 &&
            !paymentOption &&
            pathname === links.success &&
            !orderNumber &&
            !sum &&
            !name &&
            redirectToMainFromSuccess}
         {reason === 'error' && redirectError}
      </>
   );
}

Redirect.propTypes = {
   reason: PropTypes.string,
};
Redirect.defaultProps = {
   reason: null,
};

export default Redirect;
