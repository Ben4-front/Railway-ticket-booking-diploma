import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

import {
   setNumOfPassengers,
   selectNumberOfPassengers,
   selectMaxNumOfAdults,
   selectMaxNumOfChildren,
   selectMaxNumOfToddlers,
   setMaxNumOfChildren,
   setMaxNumOfToddlers,
} from '../../../../store/slices/numOfpassengersSlice';

import ticketWordFormatter from '../../../../utils/ticketWordFormatter';

import passengerTypes from '../passengerTypes';
import styles from './NumberOfPassengers.module.scss';

// если в этом компоненте только показывать выбранное кол-во мест, то можно убрать большую часть условий.
// сейчас это можно сделать, поскольку места добавляются в SeatItem, если на этом этапе не выбрали или выбрали мало

function NumberOfPassengers({ direction, adultSeats, childrenSeats }) {
   const dispatch = useDispatch();
   const maxAdultTicketsCount = useSelector(selectMaxNumOfAdults);
   const maxChildrenTicketsCount = useSelector(selectMaxNumOfChildren)[
      direction
   ];
   const maxToddlersTicketsCount = useSelector(selectMaxNumOfToddlers)[
      direction
   ];
   const numberOfPassengers = useSelector(selectNumberOfPassengers)[direction];
   const adultCount = numberOfPassengers.adults;
   const childrenCount = numberOfPassengers.children;
   const toddlerCount = numberOfPassengers.toddlers;

   const ticketWord = ticketWordFormatter(maxChildrenTicketsCount);

   useEffect(() => {
      const rest = adultCount * 2 - childrenCount - toddlerCount;

      if (rest < 0 && toddlerCount > 0) {
         dispatch(
            setNumOfPassengers({
               category: passengerTypes.toddlers,
               direction,
               value: toddlerCount - 1,
            })
         );
      }
      if (rest < 0 && toddlerCount === 0) {
         dispatch(
            setNumOfPassengers({
               category: passengerTypes.children,
               direction,
               value: childrenCount - 1,
            })
         );
      }
      dispatch(setMaxNumOfChildren({ direction, value: rest }));
      dispatch(setMaxNumOfToddlers({ direction, value: rest }));
   }, [adultCount, childrenCount, direction, dispatch, toddlerCount]);

   return (
      <div className={styles.seats}>
         <h4 className={styles.title}>Количество билетов</h4>
         <Form className={styles.form}>
            <Form.Item className={styles.formItem}>
               <Input
                  type="number"
                  prefix="Взрослых — "
                  defaultValue={0}
                  value={adultCount}
                  min={0}
                  max={maxAdultTicketsCount}
                  className={styles.input}
                  onChange={(evt) => {
                     if (Number(evt.target.value) >= adultSeats) {
                        dispatch(
                           setNumOfPassengers({
                              category: passengerTypes.adults,
                              direction,
                              value: Number(evt.target.value),
                           })
                        );
                     }
                  }}
               />
               <div>
                  {` Можно добавить еще ${maxAdultTicketsCount - adultCount}  ${
                     maxAdultTicketsCount - adultCount === 1
                        ? 'пассажира'
                        : 'пассажиров'
                  }`}
               </div>
            </Form.Item>
            <Form.Item className={styles.formItem}>
               <Input
                  type="number"
                  prefix="Детских — "
                  defaultValue={0}
                  value={childrenCount}
                  min={0}
                  max={maxChildrenTicketsCount + childrenCount}
                  className={styles.input}
                  onChange={(evt) => {
                     if (Number(evt.target.value) >= childrenSeats) {
                        dispatch(
                           setNumOfPassengers({
                              category: passengerTypes.children,
                              direction,
                              value: Number(evt.target.value),
                           })
                        );
                     }
                  }}
               />
               <div>
                  {`Можно добавить еще ${maxChildrenTicketsCount} ${ticketWord} для детей до 10 лет.
                  Свое место в вагоне, как у взрослых, но дешевле в среднем на
                  50-65%`}
               </div>
            </Form.Item>
            <Form.Item className={styles.formItem}>
               <Input
                  type="number"
                  prefix="Детских «без места» — "
                  defaultValue={0}
                  value={toddlerCount}
                  min={0}
                  max={maxToddlersTicketsCount + toddlerCount}
                  className={styles.input}
                  onChange={(evt) =>
                     dispatch(
                        setNumOfPassengers({
                           category: passengerTypes.toddlers,
                           direction,
                           value: Number(evt.target.value),
                        })
                     )
                  }
               />
               <div>
                  {` Можно добавить еще ${maxToddlersTicketsCount} ${ticketWord} для младенцев.`}
               </div>
            </Form.Item>
         </Form>
      </div>
   );
}

NumberOfPassengers.propTypes = {
   direction: PropTypes.string.isRequired,
   adultSeats: PropTypes.number.isRequired,
   childrenSeats: PropTypes.number.isRequired,
};

export default NumberOfPassengers;
