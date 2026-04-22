import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import SeatItem from './SeatItem/SeatItem';

import { selectSelectedSeats } from '../../../../../../store/slices/seatsSlice';

import classes from '../../../../classes';
import passengerTypes from '../../../passengerTypes';

import styles from './Seats.module.scss';

function Seats({
   availableSeats,
   classType,
   direction,
   coachId,
   prices,
   adultSeats,
   childrenSeats,
   coachName,
}) {
   const allSeats = useSelector(selectSelectedSeats)[direction];
   const selectedArr = allSeats
      ?.filter((el) => el.coachId === coachId)[0]
      ?.seats?.map((el) => el.seat);

   let totalSeats;

   switch (classType) {
      case classes.first:
         totalSeats = 18;
         break;
      case classes.second:
         totalSeats = 36;
         break;
      case classes.third:
         totalSeats = 54;
         break;

      default:
         totalSeats = 70;
   }

   const seatOptions = Array.from({ length: totalSeats }, (_, i) => i + 1);

   const seats = seatOptions.map((seat) =>
      availableSeats?.includes(seat) ? [seat, 'vacant'] : [seat, 'taken']
   );

   const typeOfPassengerDetector = (seatNumber) => {
      const coefficient = allSeats
         ?.filter((el) => el.coachId === coachId)[0]
         ?.seats?.filter(
            (item) => item.seat === seatNumber
         )[0]?.priceCoefficient;

      let typeOfPassenger;

      switch (coefficient) {
         case 1:
            typeOfPassenger = passengerTypes.adults;
            break;
         case 0.5:
            typeOfPassenger = passengerTypes.children;
            break;

         default:
            typeOfPassenger = 'none';
      }

      return typeOfPassenger;
   };

   const fourthClassScheme = (
      <div className={styles.coach__fourthCl}>
         <div className={styles.top__fourthCl}>
            <div className={styles.topRow__fourthCl}>
               {seats.map(
                  (seat) =>
                     seat[0] % 2 === 0 &&
                     seat[0] <= 36 && (
                        <SeatItem
                           adultSeats={adultSeats}
                           childrenSeats={childrenSeats}
                           key={coachId + seat[0]}
                           chosenSeat={
                              !!selectedArr?.some((el) => el === seat[0])
                           }
                           number={seat[0]}
                           taken={seat[1] === 'taken'}
                           coachClass={classType}
                           direction={direction}
                           coachId={coachId}
                           coachName={coachName}
                           price={prices.bottom}
                           typeOfPassenger={typeOfPassengerDetector(seat[0])}
                        />
                     )
               )}
            </div>

            <div className={styles.bottomRow__fourthCl}>
               {seats.map(
                  (seat) =>
                     seat[0] % 2 === 1 &&
                     seat[0] <= 36 && (
                        <SeatItem
                           adultSeats={adultSeats}
                           childrenSeats={childrenSeats}
                           key={coachId + seat[0]}
                           chosenSeat={
                              !!selectedArr?.some((el) => el === seat[0])
                           }
                           number={seat[0]}
                           taken={seat[1] === 'taken'}
                           coachClass={classType}
                           direction={direction}
                           coachId={coachId}
                           coachName={coachName}
                           price={prices.bottom}
                           typeOfPassenger={typeOfPassengerDetector(seat[0])}
                        />
                     )
               )}
            </div>
         </div>

         <div className={styles.bottom__fourthCl}>
            <div className={styles.topRow__fourthCl}>
               {seats.map(
                  (seat) =>
                     seat[0] % 2 === 0 &&
                     seat[0] > 36 &&
                     seat[0] < 69 && (
                        <SeatItem
                           adultSeats={adultSeats}
                           childrenSeats={childrenSeats}
                           key={coachId + seat[0]}
                           chosenSeat={
                              !!selectedArr?.some((el) => el === seat[0])
                           }
                           number={seat[0]}
                           taken={seat[1] === 'taken'}
                           coachClass={classType}
                           direction={direction}
                           coachId={coachId}
                           coachName={coachName}
                           price={prices.bottom}
                           typeOfPassenger={typeOfPassengerDetector(seat[0])}
                        />
                     )
               )}
            </div>

            <div className={styles.bottomRow__fourthCl}>
               {seats.map(
                  (seat) =>
                     ((seat[0] % 2 === 1 && seat[0] > 36) ||
                        seat[0] === 70) && (
                        <SeatItem
                           adultSeats={adultSeats}
                           childrenSeats={childrenSeats}
                           key={coachId + seat[0]}
                           chosenSeat={
                              !!selectedArr?.some((el) => el === seat[0])
                           }
                           number={seat[0]}
                           taken={seat[1] === 'taken'}
                           coachClass={classType}
                           direction={direction}
                           coachId={coachId}
                           coachName={coachName}
                           price={prices.bottom}
                           typeOfPassenger={typeOfPassengerDetector(seat[0])}
                        />
                     )
               )}
            </div>
         </div>
      </div>
   );

   const otherClassesScheme = (
      <div className={styles.coach}>
         <div className={styles.top}>
            <div className={styles.topRow}>
               {classType === classes.first &&
                  seats.map((seat) => (
                     <SeatItem
                        adultSeats={adultSeats}
                        childrenSeats={childrenSeats}
                        key={coachId + seat[0]}
                        chosenSeat={!!selectedArr?.some((el) => el === seat[0])}
                        number={seat[0]}
                        taken={seat[1] === 'taken'}
                        coachClass={classType}
                        direction={direction}
                        coachId={coachId}
                        coachName={coachName}
                        price={prices.bottom}
                        typeOfPassenger={typeOfPassengerDetector(seat[0])}
                     />
                  ))}
               {(classType === classes.second || classType === classes.third) &&
                  seats.map(
                     (seat) =>
                        seat[0] % 2 === 0 &&
                        seat[0] <= 36 && (
                           <SeatItem
                              adultSeats={adultSeats}
                              childrenSeats={childrenSeats}
                              key={coachId + seat[0]}
                              chosenSeat={
                                 !!selectedArr?.some((el) => el === seat[0])
                              }
                              number={seat[0]}
                              taken={seat[1] === 'taken'}
                              coachClass={classType}
                              direction={direction}
                              coachId={coachId}
                              coachName={coachName}
                              price={prices.top}
                              typeOfPassenger={typeOfPassengerDetector(seat[0])}
                           />
                        )
                  )}
            </div>

            {(classType === classes.second || classType === classes.third) && (
               <div className={styles.bottomRow}>
                  {seats.map(
                     (seat) =>
                        seat[0] % 2 === 1 &&
                        seat[0] <= 36 && (
                           <SeatItem
                              adultSeats={adultSeats}
                              childrenSeats={childrenSeats}
                              key={coachId + seat[0]}
                              chosenSeat={
                                 !!selectedArr?.some((el) => el === seat[0])
                              }
                              number={seat[0]}
                              taken={seat[1] === 'taken'}
                              coachClass={classType}
                              direction={direction}
                              coachId={coachId}
                              coachName={coachName}
                              price={prices.bottom}
                              typeOfPassenger={typeOfPassengerDetector(seat[0])}
                           />
                        )
                  )}
               </div>
            )}
         </div>

         <div className={styles.bottom}>
            {classType === classes.third &&
               seats.map(
                  (seat) =>
                     seat[0] > 36 && (
                        <SeatItem
                           adultSeats={adultSeats}
                           childrenSeats={childrenSeats}
                           key={coachId + seat[0]}
                           chosenSeat={
                              !!selectedArr?.some((el) => el === seat[0])
                           }
                           number={seat[0]}
                           taken={seat[1] === 'taken'}
                           coachClass={classType}
                           direction={direction}
                           coachId={coachId}
                           coachName={coachName}
                           price={prices.side}
                           typeOfPassenger={typeOfPassengerDetector(seat[0])}
                        />
                     )
               )}
         </div>
      </div>
   );

   return (
      <section>
         {classType === classes.fourth ? fourthClassScheme : otherClassesScheme}
      </section>
   );
}

Seats.propTypes = {
   availableSeats: PropTypes.arrayOf(PropTypes.number),
   classType: PropTypes.string,
   coachId: PropTypes.string.isRequired,
   coachName: PropTypes.string.isRequired,
   direction: PropTypes.string.isRequired,
   prices: PropTypes.objectOf(PropTypes.number).isRequired,
   adultSeats: PropTypes.number.isRequired,
   childrenSeats: PropTypes.number.isRequired,
};

Seats.defaultProps = {
   availableSeats: null,
   classType: null,
};

export default Seats;
