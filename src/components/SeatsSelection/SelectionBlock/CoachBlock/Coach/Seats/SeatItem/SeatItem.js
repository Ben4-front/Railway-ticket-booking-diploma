import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import { Popover } from 'antd';

import {
   addSelectedSeats,
   removeSelectedSeat,
} from '../../../../../../../store/slices/seatsSlice';
import {
   selectNumberOfPassengers,
   setNumOfPassengers,
   selectMaxNumOfAdults,
   selectMaxNumOfChildren,
} from '../../../../../../../store/slices/numOfpassengersSlice';
import { removeSeatInfoAfterUnchoosingSeat } from '../../../../../../../store/slices/passengersSlice';

import classes from '../../../../../classes';
import passengerTypes from '../../../../passengerTypes';

import styles from './SeatItem.module.scss';
import './Popover.scss';

function SeatItem({
   number,
   coachClass,
   taken,
   direction,
   coachId,
   coachName,
   price,
   chosenSeat,
   adultSeats,
   childrenSeats,
   typeOfPassenger,
}) {
   const dispatch = useDispatch();
   const [chosen, setChosen] = useState(chosenSeat);
   const [clicked, setClicked] = useState(false);
   const [open, setOpen] = useState(false);

   const numberOfPassengers = useSelector(selectNumberOfPassengers)[direction];
   const numOfAdults = numberOfPassengers?.adults;
   const numOfChildren = numberOfPassengers?.children;
   const maxNumOfAdults = useSelector(selectMaxNumOfAdults);
   const maxNumOfChildren = useSelector(selectMaxNumOfChildren)[direction];

   let className = `${styles[`seat-${coachClass}`]} ${styles.seat} ${
      taken && styles['seat-taken']
   } ${chosen && styles['seat-chosen']} ${clicked && styles['seat-clicked']}`;

   switch (coachClass) {
      case classes.first:
         className += ` ${
            number % 2 === 1 && styles[`seat-${coachClass}__odd`]
         } 
   ${number === 18 && styles[`seat-${coachClass}-last`]} 
   `;
         break;
      case classes.second:
         className += ` ${
            number % 4 === 1 && styles[`seat-${coachClass}__bottomLeft`]
         } 
     ${number % 4 === 3 && styles[`seat-${coachClass}__bottomRight`]} 
     ${number % 4 === 2 && styles[`seat-${coachClass}__topLeft`]} 
     ${number >= 35 && styles[`seat-${coachClass}-last`]}`;
         break;
      case classes.third:
         className += ` ${
            number % 4 === 1 &&
            number <= 36 &&
            styles[`seat-${coachClass}__bottomLeft`]
         } 
        ${
           number % 4 === 3 &&
           number <= 36 &&
           styles[`seat-${coachClass}__bottomRight`]
        } 
        ${
           number % 4 === 2 &&
           number <= 36 &&
           styles[`seat-${coachClass}__topLeft`]
        } 
        ${(number === 35 || number === 36) && styles[`seat-${coachClass}-last`]}
        ${number > 36 && styles[`seat-${coachClass}-side`]}
        ${
           number > 36 &&
           number % 2 === 0 &&
           styles[`seat-${coachClass}-side-even`]
        }
        ${number === 54 && styles[`seat-${coachClass}-side-even-last`]}`;
         break;
      default:
         className += ` 
         ${
            (number === 1 || number === 2) &&
            styles[`seat-${coachClass}__first`]
         } 
         ${number === 37 && styles[`seat-${coachClass}__37`]}
        ${number === 38 && styles[`seat-${coachClass}__38`]}
        ${number === 68 && styles[`seat-${coachClass}__68`]}
        `;
   }

   const seatClickHandler = () => {
      setOpen(false);
      setClicked(!clicked);
      if (!clicked) {
         setOpen(true);
      }
      if (chosen) {
         setChosen(false);
         setOpen(false);
         setClicked(false);
         dispatch(removeSelectedSeat({ number, direction, coachId }));
         dispatch(
            removeSeatInfoAfterUnchoosingSeat({ coachId, seatNumber: number })
         );
         if (numberOfPassengers[typeOfPassenger] >= 1) {
            dispatch(
               setNumOfPassengers({
                  category: typeOfPassenger,
                  direction,
                  value: numberOfPassengers[typeOfPassenger] - 1,
               })
            );
         }
      }
   };

   const typeClickHandler = (evt) => {
      if (
         evt.target.id === passengerTypes.adults &&
         numOfAdults <= adultSeats
      ) {
         dispatch(
            setNumOfPassengers({
               category: passengerTypes.adults,
               direction,
               value: adultSeats + 1,
            })
         );
      }
      if (
         evt.target.id === passengerTypes.children &&
         numOfChildren <= childrenSeats
      ) {
         dispatch(
            setNumOfPassengers({
               category: passengerTypes.children,
               direction,
               value: childrenSeats + 1,
            })
         );
      }
      dispatch(
         addSelectedSeats({
            number,
            direction,
            coachId,
            coachName,
            price,
            priceCoefficient: evt.target.id === passengerTypes.adults ? 1 : 0.5,
         })
      );
      setChosen(true);
      setClicked(false);
      setOpen(false);
   };

   const popoverContent = (
      <>
         {maxNumOfAdults > adultSeats && (
            <button
               type="button"
               id={passengerTypes.adults}
               onClick={typeClickHandler}
            >
               взрослого
            </button>
         )}
         {maxNumOfChildren + numOfChildren > childrenSeats && (
            <button
               type="button"
               id={passengerTypes.children}
               onClick={typeClickHandler}
            >
               ребенка
            </button>
         )}
         {maxNumOfAdults <= adultSeats &&
            maxNumOfChildren + numOfChildren <= childrenSeats && (
               <span>вы выбрали максимальное количество мест</span>
            )}
      </>
   );

   let visibleSeatNum;

   switch (typeOfPassenger) {
      case passengerTypes.adults:
         visibleSeatNum = 'B';
         break;
      case passengerTypes.children:
         visibleSeatNum = 'P';
         break;
      default:
         visibleSeatNum = number;
   }

   return (
      <>
         {!taken && (
            <Popover
               overlayClassName="seatItem"
               placement="top"
               title="место для"
               trigger="click"
               content={popoverContent}
               open={open}
            >
               <button
                  onClick={seatClickHandler}
                  type="button"
                  className={className}
                  disabled={taken}
               >
                  {visibleSeatNum}
               </button>
            </Popover>
         )}
         {taken && (
            <button
               onClick={seatClickHandler}
               type="button"
               className={className}
               disabled={taken}
            >
               {number}
            </button>
         )}
      </>
   );
}

SeatItem.propTypes = {
   number: PropTypes.number.isRequired,
   price: PropTypes.number.isRequired,
   coachClass: PropTypes.string.isRequired,
   taken: PropTypes.bool.isRequired,
   coachId: PropTypes.string,
   coachName: PropTypes.string.isRequired,
   direction: PropTypes.string.isRequired,
   chosenSeat: PropTypes.bool.isRequired,
   adultSeats: PropTypes.number.isRequired,
   childrenSeats: PropTypes.number.isRequired,
   typeOfPassenger: PropTypes.string.isRequired,
};

SeatItem.defaultProps = {
   coachId: null,
};

export default SeatItem;
