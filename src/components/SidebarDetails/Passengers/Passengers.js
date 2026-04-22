import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import PassengersRow from './PassengersRow/PassengersRow';

import { selectNumberOfPassengers } from '../../../store/slices/numOfpassengersSlice';

import passenger from './img/passenger.svg';
import plus from './img/plus.svg';
import minus from './img/minus.svg';

import directions from '../../../data/directions';
import passengerTypes from '../../SeatsSelection/SelectionBlock/passengerTypes';

import styles from './Passengers.module.scss';

function Passengers({
   sumDepAdults,
   sumDepChildren,
   sumArrAdults,
   sumArrChildren,
}) {
   const [expanded, setExpanded] = useState(true);
   const expandIcon = expanded ? minus : plus;
   const clickHandler = () => {
      setExpanded(!expanded);
   };

   const numOfPassengersDep = useSelector(selectNumberOfPassengers)[
      directions.departure
   ];
   const numOfPassengersArr = useSelector(selectNumberOfPassengers)[
      directions.arrival
   ];
   const numOfAdultsDep = numOfPassengersDep[passengerTypes.adults];
   const numOfAdultsArr = numOfPassengersArr[passengerTypes.adults];
   const numOfChildrenDep = numOfPassengersDep[passengerTypes.children];
   const numOfChildrenArr = numOfPassengersArr[passengerTypes.children];

   const childrenDep = (
      <PassengersRow
         className={styles.row}
         number={numOfChildrenDep}
         sum={sumDepChildren}
         type={passengerTypes.children}
      />
   );

   const childrenArr = (
      <PassengersRow
         className={styles.row}
         number={numOfChildrenArr}
         sum={sumArrChildren}
         type={passengerTypes.children}
      />
   );

   const exp = (
      <div className={styles.expandBlock}>
         <div className={styles.direction}>Туда</div>
         <div className={styles.passengers}>
            <PassengersRow
               className={styles.row}
               number={numOfAdultsDep}
               sum={sumDepAdults}
               type={passengerTypes.adults}
            />
            {numOfChildrenDep > 0 && childrenDep}
         </div>

         {numOfAdultsArr + numOfChildrenArr > 0 && (
            <>
               <div className={styles.direction}>Обратно</div>
               <div className={styles.passengers}>
                  <PassengersRow
                     className={styles.row}
                     number={numOfAdultsArr}
                     sum={sumArrAdults}
                     type={passengerTypes.adults}
                  />
                  {numOfChildrenArr > 0 && childrenArr}
               </div>
            </>
         )}
      </div>
   );

   return (
      <>
         <div className={styles.wrapperTop}>
            <h4 className={styles.header}>
               <img src={passenger} alt="иконка - пассажир" />
               <span className={styles.header__text}>Пассажиры</span>
            </h4>

            <button
               className={styles.button}
               type="button"
               onClick={clickHandler}
            >
               <img
                  className={styles.expand}
                  src={expandIcon}
                  alt="иконка управления (открыть/закрыть)"
               />
            </button>
         </div>

         {expanded && exp}
      </>
   );
}

Passengers.propTypes = {
   sumDepAdults: PropTypes.number.isRequired,
   sumDepChildren: PropTypes.number.isRequired,
   sumArrAdults: PropTypes.number.isRequired,
   sumArrChildren: PropTypes.number.isRequired,
};

export default Passengers;
