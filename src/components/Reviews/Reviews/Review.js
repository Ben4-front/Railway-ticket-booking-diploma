import React from 'react';
import PropTypes from 'prop-types';

import openQuote from './img/quote-open.svg';
import closeQuote from './img/quote-close.svg';

import styles from './Review.module.scss';

function Review({ img, name, head, text }) {
   return (
      <div className={styles.card}>
         <div className={styles.card__avatar}>
            <img src={img} alt="аватар" />
         </div>
         <div>
            <div className={styles.card__title}>{name}</div>
            <div className={styles.card__text}>
               <span>
                  <img
                     className={styles.card__open}
                     src={openQuote}
                     alt="opening quote"
                  />
                  {head} <br />
                  {text}
                  <img
                     className={styles.card__close}
                     src={closeQuote}
                     alt="closing quote"
                  />
               </span>
            </div>
         </div>
      </div>
   );
}

Review.propTypes = {
   img: PropTypes.node.isRequired,
   name: PropTypes.string.isRequired,
   head: PropTypes.string.isRequired,
   text: PropTypes.string.isRequired,
};

export default Review;
