/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CoachServices from './CoachServices/CoachServices';
import Seats from './Seats/Seats';
import SeatsTable from './SeatsTable/SeatsTable';
import PricesTable from './PricesTable/PricesTable';

import { selectSeatsOptions } from '../../../../../store/slices/seatsSlice';

import classes from '../../../classes';

import styles from './Coach.module.scss';

function Coach({
   direction,
   NumOfPplView,
   coachName,
   className,
   adultSeats,
   childrenSeats,
}) {
   const coach = useSelector(selectSeatsOptions)[direction]?.filter(
      (item) => item?.coach?.name === coachName
   )[0];

   const availableSeats = coach?.seats
      .map((item) => (item.available ? item.index : null))
      .filter((item) => item !== null);

   let prices;
   switch (coach?.coach?.class_type) {
      case classes.first:
         prices = { bottom: coach?.coach?.price };
         break;
      case classes.second:
         prices = {
            top: coach?.coach?.top_price,
            bottom: coach?.coach?.bottom_price,
         };
         break;
      case classes.third:
         prices = {
            bottom: coach?.coach?.bottom_price,
            top: coach?.coach?.top_price,
            side: coach?.coach?.side_price,
         };
         break;
      default:
         prices = { bottom: coach?.coach?.bottom_price };
   }

   const numOfSide = availableSeats?.filter((item) => item > 36)?.length;
   const numOfTop = availableSeats?.filter(
      (item) => item <= 36 && item % 2 === 0
   ).length;
   const numOfBottom = availableSeats?.filter(
      (item) => item <= 36 && item % 2 === 1
   ).length;

   const viewers = (
      <div className={styles.middle}>
         {` ${NumOfPplView} 
   ${
      `${NumOfPplView}`.slice(-1) >= 2 && `${NumOfPplView}`.slice(-1) <= 4
         ? 'человека'
         : 'человек'
   } 
   выбирают места в этом поезде`}
      </div>
   );

   return (
      <>
         {availableSeats.length > 0 && (
            <div className={className}>
               <div className={styles.top}>
                  <div className={styles.coachNumber}>
                     <span className={styles.coachNumber__name}>
                        {coach?.coach?.name}
                     </span>
                     <span className={styles.coachNumber__coach}>вагон</span>
                  </div>
                  <div className={styles.seats}>
                     <div className={styles.header}>
                        <span>места</span>
                        <span className={styles.seatsTotal}>
                           {availableSeats?.length}
                        </span>
                     </div>
                     <SeatsTable
                        coach={coach}
                        numOfTop={numOfTop}
                        numOfBottom={numOfBottom}
                        numOfSide={numOfSide}
                        numOfSeats={availableSeats?.length}
                     />
                  </div>
                  <div className={styles.price}>
                     <div className={styles.header}>стоимость</div>
                     <PricesTable
                        coach={coach}
                        numOfTop={numOfTop}
                        numOfBottom={numOfBottom}
                        numOfSide={numOfSide}
                     />
                  </div>

                  <div className={styles.service}>
                     <div className={styles.header}>
                        <span>обслуживание</span>
                        <span className={styles.serviceProvider}>фпк</span>
                     </div>

                     <CoachServices
                        direction={direction}
                        coachName={coachName}
                     />
                  </div>
               </div>
               {viewers}
               <div className={styles.bottom}>
                  <Seats
                     adultSeats={adultSeats}
                     childrenSeats={childrenSeats}
                     direction={direction}
                     coachId={coach?.coach?._id}
                     availableSeats={availableSeats}
                     classType={coach?.coach?.class_type}
                     prices={prices}
                     coachName={coachName}
                  />
               </div>
            </div>
         )}
         {availableSeats.length <= 0 && (
            <div className={styles.lastBookedText}>
               Кто-то только что забронировал последнее место в этом вагоне
            </div>
         )}
      </>
   );
}

Coach.propTypes = {
   direction: PropTypes.string.isRequired,
   NumOfPplView: PropTypes.number.isRequired,
   coachName: PropTypes.string.isRequired,
   className: PropTypes.node,
   adultSeats: PropTypes.number.isRequired,
   childrenSeats: PropTypes.number.isRequired,
};

Coach.defaultProps = {
   className: null,
};

export default Coach;
