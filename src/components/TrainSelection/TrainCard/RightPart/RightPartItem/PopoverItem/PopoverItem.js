import React from 'react';
import PropTypes from 'prop-types';

import rub from '../currency.svg';

import styles from './PopoverItem.module.scss';

function PopoverItem({ type, priceDep, priceArr }) {
   let card;
   // вытягивать кол-во мест из другого запроса с картой вагона?
   const makeItem = (name, price) => (
      <div className={styles.item}>
         <span className={styles.type}>{name}</span>
         {/* <span className={styles.seats}>10</span> */}
         <div className={styles.price}>
            <div className={styles.price__wrapper}>
               <span className={styles.price__number}>{price}</span>
               <img src={rub} alt="иконка - рубль" />
            </div>
         </div>
      </div>
   );

   if (type === 'Плацкарт') {
      if (priceDep) {
         card = (
            <>
               {priceDep.top_price && makeItem('верхние', priceDep.top_price)}
               {priceDep.bottom_price &&
                  makeItem('нижние', priceDep.bottom_price)}
               {priceDep.side_price && makeItem('боковые', priceDep.side_price)}
            </>
         );
      } else {
         card = (
            <>
               {priceArr.top_price && makeItem('верхние', priceArr.top_price)}
               {priceArr.bottom_price &&
                  makeItem('нижние', priceArr.bottom_price)}
               {priceArr.side_price && makeItem('боковые', priceArr.side_price)}
            </>
         );
      }
   }

   if (type === 'Сидячий' || type === 'Купе' || type === 'Люкс') {
      if (priceDep) {
         card = (
            <>
               {priceDep.top_price && makeItem('верхние', priceDep.top_price)}
               {priceDep.bottom_price &&
                  makeItem('нижние', priceDep.bottom_price)}
            </>
         );
      } else {
         card = (
            <>
               {priceArr.top_price && makeItem('верхние', priceArr.top_price)}
               {priceArr.bottom_price &&
                  makeItem('нижние', priceArr.bottom_price)}
            </>
         );
      }
   }

   return card;
}

PopoverItem.propTypes = {
   type: PropTypes.string.isRequired,
   priceDep: PropTypes.objectOf(PropTypes.number),
   priceArr: PropTypes.objectOf(PropTypes.number),
};

PopoverItem.defaultProps = {
   priceDep: null,
   priceArr: null,
};

export default PopoverItem;
