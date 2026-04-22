import React from 'react';
import PropTypes from 'prop-types';

import ProgressBarItem from './ProgressBarItem/ProgressBarItem';

import steps from '../../data/steps/steps';

import styles from './ProgressBar.module.scss';

function ProgressBar({ step }) {
   return (
      <div className={styles.wrapper}>
         {steps.map((item) => (
            <ProgressBarItem
               key={item.id}
               step={step}
               number={item.number}
               id={item.id}
               name={item.name}
               img={item.img}
               totalSteps={steps.length}
            />
         ))}
      </div>
   );
}

ProgressBar.propTypes = {
   step: PropTypes.number.isRequired,
};

export default ProgressBar;
