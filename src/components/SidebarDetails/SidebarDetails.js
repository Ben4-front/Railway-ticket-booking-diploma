import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Direction from './Direction/Direction';
import Passengers from './Passengers/Passengers';

import { selectSelectedSeats } from '../../store/slices/seatsSlice';

import rub from './rub.svg';

import directions from '../../data/directions';
import calculateSum from '../../utils/calculateSum';

import styles from './SidebarDetails.module.scss';

function SidebarDetails() {
   const title = useRef(document.createElement('section'));
   useEffect(() => {
      title.current.scrollIntoView({ behavior: 'smooth' });
   }, []);

   const seatsDep = useSelector(selectSelectedSeats)[directions.departure];
   const seatsArr = useSelector(selectSelectedSeats)[directions.arrival];

   const sumDepAdults = calculateSum(seatsDep, 1);
   const sumDepChildren = calculateSum(seatsDep, 0.5);
   const sumArrAdults = calculateSum(seatsArr, 1);
   const sumArrChildren = calculateSum(seatsArr, 0.5);

   return (
      <section className={styles.wrapper} ref={title}>
         <div className={styles.section}>
            <h3 className={styles['main-header']}> Детали поездки</h3>
         </div>
         <div className={styles.section}>
            <Direction direction={directions.departure} />
         </div>
         {sumArrAdults + sumArrChildren > 0 && (
            <div className={styles.section}>
               <Direction direction={directions.arrival} />
            </div>
         )}
         <div className={styles.section}>
            <Passengers
               sumDepAdults={sumDepAdults}
               sumDepChildren={sumDepChildren}
               sumArrAdults={sumArrAdults}
               sumArrChildren={sumArrChildren}
            />
         </div>
         <div className={`${styles.section} ${styles.total}`}>
            <h4 className={styles['header-total']}>Итог</h4>
            <div className={styles.sum}>
               <span>
                  {sumDepAdults +
                     sumDepChildren +
                     sumArrAdults +
                     sumArrChildren}
               </span>
               <img
                  className={styles.currency}
                  src={rub}
                  alt="иконка - рубль"
               />
            </div>
         </div>
      </section>
   );
}

export default SidebarDetails;
