import React from 'react';
import PropTypes from 'prop-types';

import styles from './FooterTitle.module.scss';

function FooterTitle({ text }) {
   return <h3 className={styles.title}>{text}</h3>;
}

FooterTitle.propTypes = { text: PropTypes.string.isRequired };

export default FooterTitle;
