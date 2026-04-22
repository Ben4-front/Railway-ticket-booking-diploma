import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { changeLimit, selectLimit } from '../../../../store/slices/sortSlice';
import { selectTotalCount } from '../../../../store/slices/trainsSlice';

import styles from './Button.module.scss';

function Button({ amount, className, onChangeFilters }) {
   const dispatch = useDispatch();
   const limit = useSelector(selectLimit);
   const totalCount = useSelector(selectTotalCount);
   const [buttonStateActive, setButtonStateActive] = useState(false);
   const buttonStylesInactive = styles.button;
   const buttonStylesActive = `${styles.button} ${styles['button-active']}`;

   const buttonStyle = buttonStateActive
      ? buttonStylesActive
      : buttonStylesInactive;

   useEffect(() => {
      // eslint-disable-next-line no-unused-expressions
      limit === amount
         ? setButtonStateActive(true)
         : setButtonStateActive(false);
   }, [amount, limit]);

   const clickHandler = () => {
      dispatch(changeLimit(amount));
      onChangeFilters();
   };

   return (
      <button
         type="button"
         onClick={clickHandler}
         className={`${buttonStyle} ${className}`}
         disabled={
            (amount === 10 && totalCount <= amount - 5) ||
            (amount === 20 && totalCount <= amount - 10)
         }
      >
         {amount}
      </button>
   );
}

Button.propTypes = {
   amount: PropTypes.number.isRequired,
   className: PropTypes.node.isRequired,
   onChangeFilters: PropTypes.func.isRequired,
};

export default Button;
