import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectSelectedSeats } from '../../../../../../store/slices/seatsSlice';
import { selectNumberOfPassengers } from '../../../../../../store/slices/numOfpassengersSlice';

import seatsWordFormatter from '../../../../../../utils/seatsWordFormatter';
import coachesWordFormatter from '../../../../../../utils/coachesWordFormatter';

import rub from './rub.svg';

import styles from './TotalPrice.module.scss';

function TotalPrice({ direction, adultSeats, childrenSeats }) {
   const seats = useSelector(selectSelectedSeats)[direction];
   const sum = seats
      .map((el) =>
         el.seats
            .map((item) => item.price * item.priceCoefficient)
            .reduce((curNumber, item) => curNumber + item, 0)
      )
      .reduce((curNumber, item) => curNumber + item, 0);

   const numberOfPassengers = useSelector(selectNumberOfPassengers)[direction];
   const numOfAdults = numberOfPassengers?.adults;
   const numOfChildren = numberOfPassengers?.children;

   const numsDraft = seats?.map(
      (el) => el.seats.filter((item) => item.seat).length
   );
   const numOfCoaches = numsDraft?.length;
   const numOfPassengers = numsDraft?.reduce(
      (curNumber, item) => curNumber + item,
      0
   );

   return (
      <div className={styles.price}>
         <div className={styles.text}>
            Вы выбрали {numOfPassengers} {seatsWordFormatter(numOfPassengers)} в{' '}
            {numOfCoaches} {coachesWordFormatter(numOfCoaches)}: взрослых -{' '}
            {adultSeats} и детских - {childrenSeats}
         </div>
         {sum >= 0 && (
            <div className={styles.total}>
               {sum}
               <img
                  className={styles.currency}
                  src={rub}
                  alt="иконка - рубль"
               />
            </div>
         )}
         {sum < 0 && (
            <div>
               Для рассчета суммы выберите количество взрослых и детских билетов
            </div>
         )}
         {numOfAdults + numOfChildren !== numOfPassengers && (
            <div className={styles.prompt}>
               Суммарное количество взрослых и детских билетов должно быть равно
               количеству выбранных вами мест
            </div>
         )}
         {numOfChildren < childrenSeats && (
            <div className={styles.alert}>
               Добавьте взрослые билеты - для перевозки такого количества детей
               нужно больше взрослых.
            </div>
         )}
      </div>
   );
}

TotalPrice.propTypes = {
   direction: PropTypes.string.isRequired,
   adultSeats: PropTypes.number.isRequired,
   childrenSeats: PropTypes.number.isRequired,
};

export default TotalPrice;
