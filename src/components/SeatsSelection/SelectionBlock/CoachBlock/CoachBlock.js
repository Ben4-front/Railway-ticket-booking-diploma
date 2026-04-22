/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Coach from './Coach/Coach';

import {
   selectSelectedCoaches,
   selectTrains,
} from '../../../../store/slices/trainSlice';
import { fetchSeats } from '../../../../store/thunks/asyncThunks';

import styles from './CoachBlock.module.scss';

function CoachBlock({ direction, NumOfPplView, adultSeats, childrenSeats }) {
   const dispatch = useDispatch();
   const activeCoaches = useSelector(selectSelectedCoaches)[direction];
   const train = useSelector(selectTrains)[direction];

   let url;
   if (train?._id) {
      url = `${process.env.REACT_APP_SEARCH_ROUTES}/${train?._id}/seats`;
   }

   useEffect(() => {
      dispatch(fetchSeats({ url, direction }));
   }, [direction, dispatch, url]);

   const classMaker = (index) => {
      let className;
      switch (index) {
         case 0:
            if (activeCoaches.length === 1) {
               className = styles.coaches;
            } else {
               className = styles['coaches-first'];
            }
            break;
         case activeCoaches.length - 1:
            className = styles['coaches-last'];
            break;
         default:
            className = styles['coaches-middle'];
      }
      return className;
   };
   return (
      <div className={styles.coaches}>
         {activeCoaches.length > 0 &&
            activeCoaches.map((coach, index) => (
               <Coach
                  adultSeats={adultSeats}
                  childrenSeats={childrenSeats}
                  key={coach.name}
                  className={classMaker(index)}
                  direction={direction}
                  NumOfPplView={NumOfPplView}
                  coachName={coach.name}
               />
            ))}
         {activeCoaches.length === 0 && (
            <div className={styles.noCoach}>
               Выберите вагон для отображения схемы
            </div>
         )}
      </div>
   );
}

CoachBlock.propTypes = {
   direction: PropTypes.string.isRequired,
   NumOfPplView: PropTypes.number.isRequired,
   adultSeats: PropTypes.number.isRequired,
   childrenSeats: PropTypes.number.isRequired,
};

export default CoachBlock;
