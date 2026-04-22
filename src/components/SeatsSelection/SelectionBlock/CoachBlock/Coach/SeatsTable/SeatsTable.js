import React from 'react';
import PropTypes from 'prop-types';

import classes from '../../../../classes';
import styles from './SeatsTable.module.scss';

function SeatsTable({ coach, numOfTop, numOfBottom, numOfSide, numOfSeats }) {
   const top = (
      <div className={styles.details}>
         <span>верхние</span>
         <span className={styles.seatsNumber}>
            {numOfTop === -1 ? 0 : numOfTop}
         </span>
      </div>
   );

   const bottom = (
      <div className={styles.details}>
         <span>нижние</span>
         {(coach?.coach?.class_type === classes.first ||
            coach?.coach?.class_type === classes.fourth) && (
            <span className={styles.seatsNumber}>{numOfSeats}</span>
         )}
         {(coach?.coach?.class_type === classes.second ||
            coach?.coach?.class_type === classes.third) && (
            <span className={styles.seatsNumber}>
               {numOfBottom === -1 ? 0 : numOfBottom}
            </span>
         )}
      </div>
   );

   const side = (
      <div className={styles.details}>
         <span>боковые</span>
         <span className={styles.seatsNumber}>
            {numOfSide === -1 ? 0 : numOfSide}
         </span>
      </div>
   );
   return (
      <>
         {(coach?.coach?.class_type === classes.second ||
            coach?.coach?.class_type === classes.third) &&
            numOfTop > 0 &&
            top}
         {numOfBottom > 0 && bottom}
         {coach?.coach?.class_type === classes.third && numOfSide > 0 && side}
      </>
   );
}

SeatsTable.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   coach: PropTypes.object.isRequired,
   numOfTop: PropTypes.number.isRequired,
   numOfBottom: PropTypes.number.isRequired,
   numOfSide: PropTypes.number.isRequired,
   numOfSeats: PropTypes.number.isRequired,
};

export default SeatsTable;
