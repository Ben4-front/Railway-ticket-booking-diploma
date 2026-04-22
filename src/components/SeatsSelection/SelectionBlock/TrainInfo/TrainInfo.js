import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import trainIcon from './img/train.svg';
import smallArrow from './img/arrow-small.svg';
import arrow from './img/arrow.svg';
import clock from './img/clock.svg';

import { selectTrains } from '../../../../store/slices/trainSlice';

import {
   datetimeToTime,
   secsToTimeWithText,
} from '../../../../utils/timeFormatters';

import styles from './TrainInfo.module.scss';

function TrainInfo({ direction }) {
   const train = useSelector(selectTrains)[direction];
   const time = secsToTimeWithText(train?.duration);
   return (
      <div className={styles.train}>
         <div className={styles.left}>
            <div className={styles.img}>
               <img src={trainIcon} alt="иконка - поезд" />
            </div>
            <div className={styles.info}>
               <span className={styles['train-name']}>
                  {train?.train?.name}
               </span>
               <span className={styles['departure-city']}>
                  {train?.from?.city?.name}
                  <img
                     className={styles['departure-arrow']}
                     src={smallArrow}
                     alt="иконка - стрелка"
                  />
               </span>
               <span className={styles['arrival-city']}>
                  {train?.to?.city?.name}
               </span>
            </div>
         </div>
         <div className={styles.middle}>
            <div className={styles.info}>
               <span className={styles.time}>
                  {datetimeToTime(train?.from?.datetime)}
               </span>
               <span className={styles.city}>{train?.from?.city?.name}</span>
               <span className={styles.station}>
                  {train?.from?.railway_station_name} вокзал
               </span>
            </div>
            <div className={styles.img}>
               <img src={arrow} alt="иконка - стрелка" />
            </div>
            <div className={styles.info}>
               <span className={styles.time}>
                  {datetimeToTime(train?.to?.datetime)}
               </span>
               <span className={styles.city}>{train?.to?.city?.name}</span>
               <span className={styles.station}>
                  {train?.to?.railway_station_name} вокзал
               </span>
            </div>
         </div>
         <div className={styles.right}>
            <div className={styles.img}>
               <img src={clock} alt="иконка - часы" />
            </div>
            <div className={styles.info}>
               <span>{time.hrs}</span>
               <span>{time.mins}</span>
            </div>
         </div>
      </div>
   );
}

TrainInfo.propTypes = {
   direction: PropTypes.string.isRequired,
};

export default TrainInfo;
