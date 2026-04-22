import React from 'react';
import PropTypes from 'prop-types';

import styles from './ProgressBarItem.module.scss';

import vector from '../img/veсtor.svg';

function ProgressBarItem({ step, number, id, name, totalSteps, img }) {
   const imgClasses = `${styles.breaker} ${
      id <= step ? `${styles['breaker-done']}` : ''
   } ${id === step ? `${styles['breaker-cut']}` : ''}`;

   return (
      <>
         <div
            className={`${styles.step} ${styles[`step-${number}`]} ${
               styles[`${id <= step ? 'step-done' : ''}`]
            } `}
         >
            <img
               className={styles.step__icon}
               src={img}
               alt={`icon -${number}`}
            />
            <div className={styles.step__name}>{name}</div>
         </div>
         {id < totalSteps && (
            <div>
               <img className={imgClasses} src={vector} alt="icon - vector" />
            </div>
         )}
      </>
   );
}

ProgressBarItem.propTypes = {
   step: PropTypes.number.isRequired,
   number: PropTypes.string.isRequired,
   id: PropTypes.number.isRequired,
   name: PropTypes.string.isRequired,
   totalSteps: PropTypes.number.isRequired,
   img: PropTypes.node.isRequired,
};

export default ProgressBarItem;
