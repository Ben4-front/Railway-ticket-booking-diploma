/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import rub from './rub.svg';

import classes from '../../../../classes';
import styles from './PricesTable.module.scss';

function PricesTable({ coach, numOfTop, numOfBottom, numOfSide }) {
   const topPrice = (
      <div className={styles.priceAmount}>
         <span>{coach?.coach?.top_price}</span>
         <div className={styles.currency}>
            <img src={rub} alt="иконка - руб." />
         </div>
      </div>
   );

   const bottomPrice = (
      <div className={styles.priceAmount}>
         {coach?.coach?.class_type !== classes.first && (
            <span>{coach?.coach?.bottom_price}</span>
         )}
         {coach?.coach?.class_type === classes.first && (
            <span>{coach?.coach?.price}</span>
         )}
         <div className={styles.currency}>
            <img src={rub} alt="иконка - руб." />
         </div>
      </div>
   );

   const sidePrice = (
      <div className={styles.priceAmount}>
         <div>{coach?.coach?.side_price}</div>
         <span className={styles.currency}>
            <img src={rub} alt="иконка - руб." />
         </span>
      </div>
   );
   return (
      <div>
         {(coach?.coach?.class_type === classes.second ||
            coach?.coach?.class_type === classes.third) &&
            numOfTop > 0 &&
            topPrice}

         {numOfBottom > 0 && bottomPrice}

         {coach?.coach?.class_type === classes.third &&
            numOfSide > 0 &&
            sidePrice}
      </div>
   );
}

PricesTable.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   coach: PropTypes.object.isRequired,
   numOfTop: PropTypes.number.isRequired,
   numOfBottom: PropTypes.number.isRequired,
   numOfSide: PropTypes.number.isRequired,
};

export default PricesTable;
