import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import TrainInfo from './TrainInfo/TrainInfo';
import NumberOfPassengers from './NumberOfPassengers/NumberOfPassengers';
import CoachType from './CoachType/CoachType';
import Coaches from './Coaches/Coaches';
import CoachBlock from './CoachBlock/CoachBlock';
import TotalPrice from './CoachBlock/Coach/TotalPrice/TotalPrice';

import { selectSelectedSeats } from '../../../store/slices/seatsSlice';

import departureArrow from './img/arrow-departure.svg';
import arrivalArrow from './img/arrow-arrival.svg';

import directions from '../../../data/directions';
import links from '../../../data/links';
import getRandomInt from '../../../utils/getRandomInt';

import styles from './SelectionBlock.module.scss';

function SelectionBlock({ direction }) {
   const navigate = useNavigate();
   const seats = useSelector(selectSelectedSeats)[direction];
   const img =
      direction === directions.departure ? departureArrow : arrivalArrow;
   const changeTrainClassName =
      direction === directions.departure
         ? `${styles['card__change-train']}`
         : `${styles['card__change-train']} ${styles['card__change-train-arrival']}`;

   const clickHandler = () => {
      navigate(links.trains);
   };

   const NumOfPplView = useMemo(() => getRandomInt(2, 25), []);

   const adultSeats = seats
      ?.map(
         (el) => el.seats?.filter((item) => item.priceCoefficient === 1)?.length
      )
      ?.reduce((curNumber, item) => curNumber + item, 0);

   const childrenSeats = seats
      ?.map(
         (el) =>
            el.seats?.filter((item) => item.priceCoefficient === 0.5)?.length
      )
      ?.reduce((curNumber, item) => curNumber + item, 0);

   return (
      <div className={styles.card}>
         <div className={changeTrainClassName}>
            <div className={styles.img}>
               <img src={img} alt="иконка - направление" />
            </div>

            <button onClick={clickHandler} type="button">
               Выбрать другой поезд
            </button>
         </div>
         <TrainInfo direction={direction} />
         <NumberOfPassengers
            direction={direction}
            adultSeats={adultSeats}
            childrenSeats={childrenSeats}
         />
         <CoachType direction={direction} />
         <Coaches direction={direction} />
         <CoachBlock
            direction={direction}
            NumOfPplView={NumOfPplView}
            adultSeats={adultSeats}
            childrenSeats={childrenSeats}
         />
         <TotalPrice
            direction={direction}
            adultSeats={adultSeats}
            childrenSeats={childrenSeats}
         />
      </div>
   );
}

SelectionBlock.propTypes = {
   direction: PropTypes.string.isRequired,
};

export default SelectionBlock;
