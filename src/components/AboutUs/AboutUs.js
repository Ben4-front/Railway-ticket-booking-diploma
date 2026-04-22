import React from 'react';

import about from '../../data/about/about';

import styles from './AboutUs.module.scss';

function AboutUs() {
   return (
      <div className={styles.about} id="about">
         <span className={styles.about__title}>о нас</span>
         <div className={styles.about__text}>{about}</div>
      </div>
   );
}

export default AboutUs;
