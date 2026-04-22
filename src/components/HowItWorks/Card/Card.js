import React from 'react';
import PropTypes from 'prop-types';

import styles from './Card.module.scss';

function Card({ img, alt, text }) {
   return (
      <div className={styles.card}>
         <div className={styles.card__iconContainer}>
            <img className={styles.card__icon} src={img} alt={alt} />
         </div>
         <div className={styles.card__text}>{text}</div>
      </div>
   );
}

Card.propTypes = {
   img: PropTypes.node.isRequired,
   alt: PropTypes.string,
   text: PropTypes.string.isRequired,
};

Card.defaultProps = {
   alt: 'icon',
};

export default Card;
