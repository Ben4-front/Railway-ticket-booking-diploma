/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Alert } from 'antd';

import TrainCard from '../TrainSelection/TrainCard/TrainCard';
import PasItem from './PasItem/PasItem';

import { postOrder } from '../../store/thunks/asyncThunks';

import { selectTrainsOptions } from '../../store/slices/trainsSlice';
import { selectIndex, selectTrains } from '../../store/slices/trainSlice';
import { selectPersonalData } from '../../store/slices/personalDataSlice';
import { selectSelectedSeats } from '../../store/slices/seatsSlice';
import {
   selectPassengers,
   removePassenger,
} from '../../store/slices/passengersSlice';
import {
   selectResponse,
   selectLoading,
   selectError,
} from '../../store/slices/orderConfirmationSlice';
import { addOrderData } from '../../store/slices/orderSlice';

import links from '../../data/links';
import directions from '../../data/directions';
import fieldNames from '../PaymentOptions/fieldNames';
// eslint-disable-next-line import/no-named-default
import { default as pasFieldNames } from '../PassengersSelection/PassengerCard/fieldNames';
import calculateSum from '../../utils/calculateSum';
import paymentTypes from '../PaymentOptions/paymentTypes';
import getRandomInt from '../../utils/getRandomInt';

import rub from './rub.svg';

import styles from './OrderConfirmation.module.scss';
import passengerTypes from '../SeatsSelection/SelectionBlock/passengerTypes';
import docTypes from '../PassengersSelection/PassengerCard/docTypes';

const seatsModifier = (obj) =>
   obj
      .map((el) =>
         el.seats.map((item) => ({
            seatNumber: item.seat,
            coachId: el.coachId,
            passengerId: item.passengerId,
         }))
      )
      .flat();

function OrderConfirmation() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const selectedTrainIndex = useSelector(selectIndex);
   const trains = useSelector(selectTrains);
   const seatsDep = useSelector(selectSelectedSeats)[directions.departure];
   const seatsArr = useSelector(selectSelectedSeats)[directions.arrival];
   const passengers = useSelector(selectPassengers);
   const personalData = useSelector(selectPersonalData);
   const paymentOption = personalData[fieldNames.paymentMethod];
   const requestResponse = useSelector(selectResponse);
   const requestLoading = useSelector(selectLoading);
   const requestError = useSelector(selectError);
   const trainsOptions = useSelector(selectTrainsOptions);

   const sum =
      calculateSum(seatsDep, 1) +
      calculateSum(seatsDep, 0.5) +
      calculateSum(seatsArr, 1) +
      calculateSum(seatsArr, 0.5);

   useEffect(() => {
      const pasWithoutSeats = passengers.filter(
         (pas) => !pas[pasFieldNames.seatDep] && !pas[pasFieldNames.seatArr]
      );
      if (pasWithoutSeats.length >= 1) {
         pasWithoutSeats.forEach((pas) => dispatch(removePassenger(pas.id)));
      }
   }, [dispatch, passengers]);

   const onEditBtnClick = (link) => {
      navigate(link);
   };

   const editBtnMaker = (link) => (
      <button
         type="button"
         onClick={() => onEditBtnClick(link)}
         className={styles.buttonEdit}
      >
         Изменить
      </button>
   );

   const editTrainBtn = editBtnMaker(links.trains);

   const clickHandler = () => {
      const seatDataConstructor = (el) => {
         const pas = passengers?.find((item) => item?.id === el?.passengerId);
         const date = pas[pasFieldNames?.dateOfBirth]?.split('.');
         return {
            coach_id: el?.coachId,
            person_info: {
               is_adult:
                  pas[pasFieldNames?.passengerType] === passengerTypes?.adults,
               first_name: pas[pasFieldNames?.firstName],
               last_name: pas[pasFieldNames?.lastName],
               patronymic: pas[pasFieldNames?.fathersName],
               gender: pas[pasFieldNames?.gender] === 'true',
               birthday: `${date[2]}-${date[1]}-${date[0]}`,
               document_type:
                  pas[pasFieldNames?.docType] === docTypes?.passport
                     ? docTypes?.passportRus.toLowerCase()
                     : docTypes?.birthCertifRus.toLowerCase(),
               document_data:
                  pas[pasFieldNames?.docType] === docTypes?.passport
                     ? `${pas[pasFieldNames?.docSerialNumber]} ${
                          pas[pasFieldNames?.docNumberPass]
                       }`
                     : pasFieldNames?.docNumberSertif,
            },
            seat_number: el?.seatNumber,
            is_child:
               pas[pasFieldNames?.passengerType] === passengerTypes?.children,
         };
      };

      const user = {
         first_name: personalData[fieldNames?.firstName],
         last_name: personalData[fieldNames?.lastName],
         patronymic: personalData[fieldNames?.fathersName],
         phone: personalData[fieldNames?.phone],
         email: personalData[fieldNames?.email],
         payment_method: paymentOption,
      };

      const depId = trains[directions.departure]?._id;
      const arrId = trains[directions.arrival]?._id;

      const request = { user };

      if (depId) {
         const seatsDepModified = seatsModifier(seatsDep);
         const seatsDepForRequest = seatsDepModified?.map((el) =>
            seatDataConstructor(el)
         );

         request[directions.departure] = {
            route_direction_id: depId,
            seats: seatsDepForRequest,
         };
      }
      if (arrId) {
         const seatsArrModified = seatsModifier(seatsArr);
         const seatsArrForRequest = seatsArrModified?.map((el) =>
            seatDataConstructor(el)
         );

         request[directions.arrival] = {
            route_direction_id: arrId,
            seats: seatsArrForRequest,
         };
      }

      dispatch(
         postOrder({
            url: process.env.REACT_APP_POST_ORDER,
            request,
         })
      );
   };

   useEffect(() => {
      if (!requestLoading && !requestError && requestResponse) {
         dispatch(
            addOrderData({
               orderNumber: `${getRandomInt(10, 548)}${personalData[
                  fieldNames?.firstName
               ]
                  ?.slice(0, 1)
                  .toUpperCase()}${personalData[fieldNames?.fathersName]
                  ?.slice(0, 1)
                  .toUpperCase()}`,
               sum,
               name: `${personalData[fieldNames?.firstName]} ${
                  personalData[fieldNames?.fathersName]
               }`,
            })
         );
         navigate(links.success);
      }
   }, [
      dispatch,
      navigate,
      personalData,
      requestError,
      requestLoading,
      requestResponse,
      sum,
   ]);

   const trainCard = (
      <div className={styles.card}>
         <div className={styles.header}>Поезд</div>
         <TrainCard
            ticket={trainsOptions[selectedTrainIndex]?.ticket}
            editBtn={editTrainBtn}
         />
      </div>
   );

   const allPassengers = (
      <div className={styles.card}>
         <div className={styles.header}>Пассажиры</div>
         <div className={styles.info}>
            <div className={styles.left}>
               {passengers?.map((pas) => (
                  <PasItem key={pas.id} pas={pas} />
               ))}
            </div>
            <div className={styles.right}>
               <div className={styles.sum}>
                  <span>Всего</span>
                  <span>
                     <span className={styles.amount}>{sum}</span>
                     <img
                        className={styles.currency}
                        src={rub}
                        alt="иконка - рубль"
                     />
                  </span>
               </div>
               {editBtnMaker(links.passengers)}
            </div>
         </div>
      </div>
   );

   const payment = (
      <div className={styles.card}>
         <div className={styles.header}>Способ оплаты</div>
         <div className={styles.info}>
            <div className={styles.left}>
               <div className={styles.payment}>
                  {paymentOption === paymentTypes.cashEng
                     ? paymentTypes.cash
                     : paymentTypes.online}
               </div>
            </div>
            <div className={styles.right}>
               {editBtnMaker(links.paymentOptions)}
            </div>
         </div>
      </div>
   );

   const btnForward = (
      <>
         <div className={styles.buttonForward}>
            <button onClick={clickHandler} type="submit">
               подтвердить
            </button>
         </div>
         {requestError && (
            <Alert
               className={styles.alert}
               message={requestError}
               type="error"
            />
         )}
      </>
   );

   return (
      <>
         {trainCard}
         {allPassengers}
         {payment}
         {btnForward}
      </>
   );
}

export default OrderConfirmation;
