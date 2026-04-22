import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

import PopoverItem from './PopoverItem/PopoverItem';

import rub from './currency.svg';

import styles from './RightPartItem.module.scss';
import './Popover.scss';

function RightPartItem({ type, seatsNum, priceDep, priceArr }) {
   const priceCombiner = () =>
      [
         priceDep?.price,
         priceDep?.top_price,
         priceDep?.bottom_price,
         priceDep?.side_price,
         priceArr?.price,
         priceArr?.top_price,
         priceArr?.bottom_price,
         priceArr?.side_price,
      ].filter((item) => typeof item === 'number');

   const popoverContent = (
      <PopoverItem type={type} priceDep={priceDep} priceArr={priceArr} />
   );

   return (
      <Popover
         overlayClassName="right-part"
         content={popoverContent}
         placement="bottom"
      >
         <div className={styles.card}>
            <span className={styles.type}>{type}</span>
            <span className={styles.seats}>{seatsNum}</span>
            <div className={styles.price}>
               <div className={styles.price__wrapper}>
                  <span className={styles.price__start}>от </span>
                  <span className={styles.price__number}>
                     {Math.min(...priceCombiner())}
                  </span>
                  <img src={rub} alt="иконка - рубль" />
               </div>
            </div>
         </div>
      </Popover>
   );
}

RightPartItem.propTypes = {
   type: PropTypes.string.isRequired,
   seatsNum: PropTypes.number.isRequired,
   priceDep: PropTypes.objectOf(PropTypes.number),
   priceArr: PropTypes.objectOf(PropTypes.number),
};

RightPartItem.defaultProps = {
   priceDep: null,
   priceArr: null,
};

export default RightPartItem;
