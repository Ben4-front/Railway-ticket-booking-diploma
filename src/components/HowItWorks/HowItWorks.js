import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';

import Card from './Card/Card';

import cards from '../../data/how-it-works/how-it-works';
import styles from './HowItWorks.module.scss';

function HowItWorks() {
   const { pathname } = useLocation();
   return (
      <div className={styles.how}>
         <div className={styles.how__wrapperTop}>
            <div className={styles.how__title}>как это работает</div>
            <HashLink smooth to={`${pathname}/#contacts`}>
               <button className={styles.how__btn} type="button">
                  Узнать больше
               </button>
            </HashLink>
         </div>
         <div className={styles.how__steps}>
            {cards.map((card) => (
               <Card key={card.id} img={card.img} text={card.text} />
            ))}
         </div>
      </div>
   );
}

export default HowItWorks;
