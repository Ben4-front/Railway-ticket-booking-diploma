/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import LeftPart from './LeftPart/LeftPart';
import MiddlePart from './MiddlePart/MiddlePart';
import RightPart from './RightPart/RightPart';

import { setIndex, setTrains } from '../../../store/slices/trainSlice';

import arrowRight from './img/arrow-right.svg';
import arrowLeft from './img/arrow-left.svg';

import directions from '../../../data/directions';
import links from '../../../data/links';

import styles from './TrainCard.module.scss';

// цены и количество билетов совмещать для двух поездов? - сейчас так делаю
// или отдельно выводить для поезда туда и для поезда обратно? - тогда размер карточки увеличится. но это логичнее.

function TrainCard({ ticket, id, editBtn }) {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const availableSeats = ticket?.available_seats_info;
   const priceDep = ticket?.departure?.price_info;
   const priceArr = ticket?.arrival?.price_info;

   const departureFrom = ticket?.departure?.from;
   const departureTo = ticket?.departure?.to;
   const arrivalFrom = ticket?.arrival?.from;
   const arrivalTo = ticket?.arrival?.to;

   const onClick = (evt) => {
      if (id !== null) {
         evt.preventDefault();
         dispatch(setIndex(id));
         dispatch(
            setTrains({
               value: ticket.departure,
               direction: directions.departure,
            })
         );
         if (ticket.arrival) {
            dispatch(
               setTrains({
                  value: ticket.arrival,
                  direction: directions.arrival,
               })
            );
         }
         navigate(links.seats);
      }
   };

   return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div className={styles.card} role="button" tabIndex={0}>
         <div className={styles.card__left}>
            <LeftPart
               depTrain={ticket?.departure?.train?.name}
               depFrom={ticket?.departure?.from?.city?.name}
               depTo={ticket?.departure?.to?.city?.name}
               arrTrain={ticket?.arrival?.train?.name}
               arrTo={ticket?.arrival?.to?.city?.name}
            />
         </div>
         <div className={styles.card__middle}>
            <MiddlePart
               depTime={departureFrom?.datetime}
               depCity={departureFrom?.city?.name}
               depStation={departureFrom?.railway_station_name}
               duration={ticket?.departure?.duration}
               arrow={arrowRight}
               arrTime={departureTo?.datetime}
               arrCity={departureTo?.city?.name}
               arrStation={departureTo?.railway_station_name}
            />
            {ticket?.arrival && (
               <MiddlePart
                  depTime={arrivalFrom?.datetime}
                  depCity={arrivalFrom?.city?.name}
                  depStation={arrivalFrom?.railway_station_name}
                  duration={ticket?.arrival?.duration}
                  arrow={arrowLeft}
                  arrTime={arrivalTo?.datetime}
                  arrCity={arrivalTo?.city?.name}
                  arrStation={arrivalTo?.railway_station_name}
               />
            )}
         </div>
         <div className={styles.card__right}>
            <RightPart
               id={id}
               onClick={onClick}
               availableSeats={availableSeats}
               priceDep={priceDep}
               priceArr={priceArr}
               wifi={ticket?.departure?.have_wifi || ticket?.arrival?.have_wifi}
               conditioner={
                  ticket?.departure?.have_air_conditioning ||
                  ticket?.arrival?.have_air_conditioning
               }
               express={
                  ticket?.departure?.is_express || ticket?.arrival?.is_express
               }
               editBtn={editBtn}
            />
         </div>
      </div>
   );
}

TrainCard.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   ticket: PropTypes.object,
   id: PropTypes.number,
   editBtn: PropTypes.node,
};

TrainCard.defaultProps = {
   ticket: null,
   id: null,
   editBtn: null,
};

export default TrainCard;
