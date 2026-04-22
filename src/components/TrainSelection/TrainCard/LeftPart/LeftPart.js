import React from 'react';
import PropTypes from 'prop-types';

import train from './img/train.svg';
import arrow from './img/arrow.svg';

import styles from './LeftPart.module.scss';

function LeftPart({ depTrain, arrTrain, depFrom, depTo, arrTo }) {
   return (
      <>
         <div className={styles.img}>
            <img src={train} alt="иконка поезда" />
         </div>
         <span className={styles['train-name']}>{depTrain}</span>
         <span className={styles['departure-city']}>
            {depFrom}
            <img
               className={styles['departure-arrow']}
               src={arrow}
               alt="иконка - стрелка"
            />
         </span>
         <span className={styles['arrival-city']}>
            {depTo}
            {arrTrain && (
               <img
                  className={styles['departure-arrow']}
                  src={arrow}
                  alt="иконка - стрелка"
               />
            )}
         </span>
         {arrTrain && (
            <>
               <span className={styles['arrival-city']}>{arrTo}</span>

               <span className={styles['train-name']}>{arrTrain}</span>
            </>
         )}
      </>
   );
}

LeftPart.propTypes = {
   depTrain: PropTypes.string.isRequired,
   depFrom: PropTypes.string.isRequired,
   depTo: PropTypes.string.isRequired,
   arrTrain: PropTypes.string,
   arrTo: PropTypes.string,
};

LeftPart.defaultProps = { arrTrain: null, arrTo: null };

export default LeftPart;
