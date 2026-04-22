import React from 'react';
import PropTypes from 'prop-types';

import styles from './ContactItem.module.scss';

function ContactItem({ icon, alt, children }) {
   return (
      <li className={styles.contact__item}>
         <img className={styles.contact__icon} src={icon} alt={alt} />
         <div className={styles.contact__text}>{children}</div>
      </li>
   );
}

ContactItem.propTypes = {
   icon: PropTypes.node.isRequired,
   children: PropTypes.node.isRequired,
   alt: PropTypes.string.isRequired,
};

export default ContactItem;
