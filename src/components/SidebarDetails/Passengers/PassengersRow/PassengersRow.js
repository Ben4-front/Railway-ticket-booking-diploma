import React from 'react';
import PropTypes from 'prop-types';

import childrenFormatter from '../../../../utils/childrenFormatter ';

import rub from './rub.svg';

import passengerTypes from '../../../SeatsSelection/SelectionBlock/passengerTypes';

import styles from './PassengersRow.module.scss';

function PassengersRow({ number, sum, type, className }) {
   const adultsWord = number === 1 ? 'Взрослый' : 'Взрослых';
   const childrenWord = childrenFormatter(number);
   const word = type === passengerTypes.adults ? adultsWord : childrenWord;

   return (
      <div className={className}>
         <div className={styles.passengerType}>{`${number} ${word} `}</div>
         <div className={styles.sum}>
            <span>{sum}</span>
            <img className={styles.currency} src={rub} alt="иконка - рубль" />
         </div>
      </div>
   );
}

PassengersRow.propTypes = {
   number: PropTypes.number.isRequired,
   sum: PropTypes.number.isRequired,
   type: PropTypes.string.isRequired,
   className: PropTypes.node.isRequired,
};

export default PassengersRow;
