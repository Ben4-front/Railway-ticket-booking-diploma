import React from 'react';
import PropTypes from 'prop-types';

import styles from './LastTicketItem.module.scss';
import rub from './img/rub.svg';
import food from './img/food.svg';
import wifi from './img/wifi.svg';
import conditioner from './img/conditioner.svg';
import express from './img/express.svg';

function LastTicketItem({ ticket }) {
   const wifiImg = (
      <div className={styles.icons__content}>
         <img src={wifi} alt="иконкa wifi" />
      </div>
   );
   const conditionerImg = (
      <div className={styles.icons__content}>
         <img src={conditioner} alt="иконкa кондиционер" />
      </div>
   );
   const expressImg = (
      <div className={styles.icons__content}>
         <img src={express} alt="иконкa экспресс" />
      </div>
   );
   return (
      <div className={styles.card}>
         <div className={`${styles.direction} ${styles.direction__from}`}>
            <span className={styles.direction__city}>{ticket.from.city}</span>
            <span className={styles.direction__station}>
               {ticket.from.station}
            </span>
         </div>
         <div className={`${styles.direction} ${styles.direction__to}`}>
            <span className={styles.direction__city}>{ticket.to.city}</span>
            <span className={styles.direction__station}>
               {ticket.to.station}
            </span>
         </div>
         <div className={styles.icons}>
            {ticket.icons.wifi && wifiImg}

            {ticket.icons.conditioner && conditionerImg}

            {ticket.icons.express && expressImg}
            <div className={styles.icons__content}>
               <img src={food} alt="иконкa еда" />
            </div>
         </div>
         <div className={styles.price}>
            <div className={styles.price__wrapper}>
               <span className={styles.price__start}>от</span>
               <span className={styles.price__number}>{ticket.price}</span>
               <img
                  className={styles.price__currency}
                  src={rub}
                  alt="иконка - рубль"
               />
            </div>
         </div>
      </div>
   );
}

LastTicketItem.propTypes = {
   ticket: PropTypes.PropTypes.shape({
      id: PropTypes.number,
      price: PropTypes.number,
      from: PropTypes.objectOf(PropTypes.string),
      to: PropTypes.objectOf(PropTypes.string),
      icons: PropTypes.objectOf(PropTypes.bool),
   }),
};

LastTicketItem.defaultProps = {
   ticket: null,
};

export default LastTicketItem;
