/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import SelectionBlock from './SelectionBlock/SelectionBlock';
import Redirect from '../Redirect/Redirect';

import { selectTrains } from '../../store/slices/trainSlice';
import { selectSelectedSeats } from '../../store/slices/seatsSlice';
import {
   selectNumberOfPassengers,
   removeNumOfPassengersDirection,
} from '../../store/slices/numOfpassengersSlice';

import directions from '../../data/directions';
import links from '../../data/links';

import styles from './SeatsSelection.module.scss';

function SeatsSelection() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const arrival = useSelector(selectTrains)[directions.arrival]?._id;
   const departure = useSelector(selectTrains)[directions.departure]?._id;

   const [disabled, setDisabled] = useState(true);
   const selectedSeats = useSelector(selectSelectedSeats);
   const numberOfPassengers = useSelector(selectNumberOfPassengers);

   const seatsDep = selectedSeats[directions.departure]
      ?.map((el) => el.seats)
      .flat()?.length;
   const passDep = Object.entries(
      numberOfPassengers[directions.departure]
   )?.reduce((curNumber, item) => curNumber + item[1], 0);

   const seatsArr = selectedSeats[directions.arrival]
      ?.map((el) => el.seats)
      ?.flat()?.length;
   const passArr = Object.entries(
      numberOfPassengers[directions.arrival]
   )?.reduce((curNumber, item) => curNumber + item[1], 0);

   useEffect(() => {
      if (!arrival) {
         dispatch(removeNumOfPassengersDirection(directions.arrival));
      }
   }, [arrival, dispatch]);

   useEffect(() => {
      if (
         seatsDep !== 0 &&
         passDep !== 0 &&
         (!arrival || (seatsArr !== 0 && passArr !== 0))
      ) {
         if (seatsDep === passDep && (!arrival || seatsArr === passArr)) {
            setDisabled(false);
         } else {
            setDisabled(true);
         }
      }
   }, [disabled, seatsDep, passDep, seatsArr, passArr, arrival]);

   const clickHandler = () => {
      navigate(links.passengers);
   };

   const button = (
      <div className={styles['seats-selection__button-wrapper']}>
         <button onClick={clickHandler} type="button" disabled={disabled}>
            далее
         </button>
      </div>
   );

   return (
      <section className={styles['seats-selection']}>
         <h3 className={styles['seats-selection__header']}>выбор мест</h3>
         {departure && <SelectionBlock direction={directions.departure} />}
         {arrival && <SelectionBlock direction={directions.arrival} />}
         {departure && button}
         <Redirect />
      </section>
   );
}

export default SeatsSelection;
