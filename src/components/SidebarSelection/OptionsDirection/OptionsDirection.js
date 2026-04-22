import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import TimeSlider from './TimeSlider/TimeSlider';

import {
   selectTime,
   setExpanded,
} from '../../../store/slices/sidebarSelectSlice';

import styles from './OptionsDirection.module.scss';

import plus from '../img/plus.svg';
import minus from '../img/minus.svg';

function OptionsDirection({ img, direction, name, onChangeOption }) {
   const dispatch = useDispatch();
   const { expanded } = useSelector(selectTime)[name];

   const expandIcon = expanded ? minus : plus;

   const clickHandler = () => {
      dispatch(setExpanded({ name }));
   };

   const exp = (
      <div className={styles.expanded}>
         <h6 className={styles.expanded__header}>Время отбытия</h6>
         <TimeSlider
            name={name}
            direction="departure"
            onChangeOption={onChangeOption}
         />
         <div className={styles.expanded__ret}>
            <h6 className={styles.expanded__header}>Время прибытия</h6>
            <TimeSlider
               name={name}
               direction="arrival"
               onChangeOption={onChangeOption}
            />
         </div>
      </div>
   );

   return (
      <>
         <div className={styles.header}>
            <h4 className={styles.header__left}>
               <img src={img} alt={`стрелка направления - ${direction}`} />
               <span className={styles.direction__text}>{direction}</span>
            </h4>
            <button
               className={styles.header__button}
               type="button"
               onClick={clickHandler}
            >
               <img
                  className={styles.header__expand}
                  src={expandIcon}
                  alt="иконка управления (открыть/закрыть)"
               />
            </button>
         </div>

         {expanded && exp}
      </>
   );
}

OptionsDirection.propTypes = {
   img: PropTypes.node.isRequired,
   direction: PropTypes.string.isRequired,
   name: PropTypes.string.isRequired,
   onChangeOption: PropTypes.func.isRequired,
};

export default OptionsDirection;
