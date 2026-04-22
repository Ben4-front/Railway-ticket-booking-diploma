import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectTrains } from '../../../store/slices/trainSlice';

import {
   datetimeToDate,
   datetimeToTime,
   secsToTime,
} from '../../../utils/timeFormatters';

import arrowTo from './img/arrow-to.svg';
import arrowBack from './img/arrow-back.svg';
import arrowDeparture from './img/arrow-departure.svg';
import arrowArrival from './img/arrow-arrival.svg';
import plus from './img/plus.svg';
import minus from './img/minus.svg';

import directions from '../../../data/directions';

import styles from './Direction.module.scss';

function Direction({ direction }) {
   const [expanded, setExpanded] = useState(true);
   const expandIcon = expanded ? minus : plus;
   const img = direction === directions.departure ? arrowTo : arrowBack;
   const arrow =
      direction === directions.departure ? arrowDeparture : arrowArrival;
   const directionRus = direction === directions.departure ? 'туда' : 'обратно';
   const train = useSelector(selectTrains)[direction];

   const clickHandler = () => {
      setExpanded(!expanded);
   };

   const exp = (
      <div className={styles.expandBlock}>
         <div className={styles.row}>
            <div className={styles.name}>Название поезда</div>
            <div className={styles.trainName}>{train?.train?.name}</div>
         </div>
         <div className={styles.totalTime}>{secsToTime(train?.duration)}</div>
         <div className={styles.directions}>
            <div className={styles.top}>
               <div className={styles.direction}>
                  <span className={styles.time}>
                     {datetimeToTime(train?.from?.datetime)}
                  </span>
                  <span className={styles.date}>
                     {datetimeToDate(train?.from?.datetime)}
                  </span>
               </div>

               <div className={styles.arrow}>
                  <img src={arrow} alt="иконка - стрелка" />
               </div>

               <div className={`${styles.direction} ${styles.right}`}>
                  <span className={styles.time}>
                     {datetimeToTime(train?.to?.datetime)}
                  </span>
                  <span className={styles.date}>
                     {datetimeToDate(train?.to?.datetime)}
                  </span>
               </div>
            </div>
            <div className={styles.bottom}>
               <div className={styles.direction}>
                  <span className={styles.city}>{train?.from?.city?.name}</span>
                  <span className={styles.station}>
                     {train?.from?.railway_station_name}
                  </span>
                  <span className={styles.station}>вокзал</span>
               </div>
               <div className={`${styles.direction} ${styles.right}`}>
                  <span className={styles.city}>{train?.to?.city?.name}</span>
                  <span className={styles.station}>
                     {train?.to?.railway_station_name}
                  </span>
                  <span className={styles.station}>вокзал</span>
               </div>
            </div>
         </div>
      </div>
   );
   return (
      <>
         <div className={styles.wrapperTop}>
            <h4 className={styles.header}>
               <img src={img} alt={`стрелка направления - ${directionRus}`} />
               <span className={styles.header__text}>{directionRus}</span>
            </h4>
            <div className={styles.date}>
               {datetimeToDate(train?.from?.datetime)}
            </div>
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

Direction.propTypes = { direction: PropTypes.string.isRequired };

export default Direction;
