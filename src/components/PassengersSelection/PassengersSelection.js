/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { nanoid } from 'nanoid';

import PassengerCard from './PassengerCard/PassengerCard';

import { selectSelectedSeats } from '../../store/slices/seatsSlice';
import { selectPassengers } from '../../store/slices/passengersSlice';

import links from '../../data/links';
import passengerTypes from '../SeatsSelection/SelectionBlock/passengerTypes';
import directions from '../../data/directions';

import plus from './img/plus.svg';

import styles from './PassengersSelection.module.scss';

const seatsModifier = (obj) =>
   obj
      .map((el) =>
         el.seats.map((item) => ({
            ...item,
            coachId: el.coachId,
            coachName: el.coachName,
         }))
      )
      .flat();

function PassengersSelection() {
   const navigate = useNavigate();
   const [passArray, setPassArray] = useState([]);
   const seatsDep = useSelector(selectSelectedSeats)[directions.departure];
   const seatsArr = useSelector(selectSelectedSeats)[directions.arrival];
   const passengers = useSelector(selectPassengers);

   const seatsDepModified = seatsModifier(seatsDep);
   const seatsArrModified = seatsModifier(seatsArr);

   const unchosenSeatsDep = useMemo(
      () => [...seatsDepModified.filter((el) => el.passengerId === null)],
      [seatsDepModified]
   );
   const unchosenSeatsArr = useMemo(
      () => [...seatsArrModified.filter((el) => el.passengerId === null)],
      [seatsArrModified]
   );

   const unchosenSeats = useMemo(
      () => [...unchosenSeatsDep, ...unchosenSeatsArr],
      [unchosenSeatsArr, unchosenSeatsDep]
   );

   const forwardBtn = useRef(document.createElement('button'));

   useEffect(() => {
      if (!unchosenSeats.length > 0) {
         forwardBtn?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
         });
      }
   }, [unchosenSeats]);

   useEffect(() => {
      const addToArray = (pas) => {
         const sameId = passArray.find((item) => item.id === pas.id);
         if (sameId !== -1) {
            setPassArray((prev) => [...prev, { id: pas.id }]);
         }
      };
      passengers.forEach((pas) => addToArray(pas));
      if (
         unchosenSeats.length > 0 &&
         passengers.filter((pas) => !pas.seatArr && !pas.seatDep).length <= 0
      ) {
         setPassArray((prev) => [...prev, { id: nanoid() }]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const unchosenAdultSeats = unchosenSeats.filter(
      (el) => el.priceCoefficient === 1
   );

   const clickOnAddPassHandler = () => {
      if (unchosenSeats.length > 0) {
         setPassArray((prev) => [...prev, { id: nanoid() }]);
      }
   };

   const clickOnNextPassHandler = (id) => {
      const index = passArray.findIndex((el) => el.id === id);

      if (index === passArray.length - 1 && unchosenSeats.length > 0) {
         setPassArray((prev) => [...prev, { id: nanoid() }]);
      } else {
         const element = document.getElementById(`${passArray[index + 1].id}`);
         element.scrollIntoView({ behavior: 'smooth' });
      }
   };

   const clickOnRemovePassHandler = (id) => {
      setPassArray((prev) => prev.filter((el) => el.id !== id));
   };

   const clickHandler = () => {
      navigate(links.paymentOptions);
   };

   const addPassenger = (
      <button
         type="button"
         className={styles.addPassenger}
         onClick={clickOnAddPassHandler}
      >
         <span className={styles.text}>Добавить пассажира</span>
         <img src={plus} alt="иконка - добавить" />
      </button>
   );

   const button = (
      <div className={styles.buttonWrapper}>
         <button
            ref={forwardBtn}
            onClick={clickHandler}
            type="button"
            disabled={unchosenSeats.length > 0}
         >
            далее
         </button>
      </div>
   );

   return (
      <div>
         {passArray.map((item, index) => (
            <PassengerCard
               key={item.id}
               passengerType={
                  unchosenAdultSeats.length >= 1
                     ? passengerTypes.adults
                     : passengerTypes.children
               }
               id={item.id}
               pasNumber={index + 1}
               clickOnRemovePassHandler={clickOnRemovePassHandler}
               clickOnNextPassHandler={clickOnNextPassHandler}
               unchosenSeats={unchosenSeats}
               unchosenSeatsDep={unchosenSeatsDep}
               unchosenSeatsArr={unchosenSeatsArr}
            />
         ))}
         {unchosenSeats.length > 0 && addPassenger}
         {(seatsDep.length > 0 || seatsArr.length > 0) && button}
      </div>
   );
}

export default PassengersSelection;
