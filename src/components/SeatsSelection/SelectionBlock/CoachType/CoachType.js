import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import CoachTypeItem from './CoachTypeItem/CoachTypeItem';

import { selectTrains } from '../../../../store/slices/trainSlice';

import fourth from './img/fourth.svg';
import third from './img/third.svg';
import second from './img/second.svg';
import first from './img/first.svg';
import fourthActive from './img/fourth-active.svg';
import thirdActive from './img/third-active.svg';
import secondActive from './img/second-active.svg';
import firstActive from './img/first-active.svg';

import classes from '../../classes';

import styles from './CoachType.module.scss';

function CoachType({ direction }) {
   const train = useSelector(selectTrains)[direction];
   const coachTypes = [
      {
         id: 4,
         img: fourth,
         imgActive: fourthActive,
         name: classes.fourth,
         nameRus: 'сидячий',
         available: train?.have_fourth_class,
      },
      {
         id: 3,
         img: third,
         imgActive: thirdActive,
         name: classes.third,
         nameRus: 'плацкарт',
         available: train?.have_third_class,
      },
      {
         id: 2,
         img: second,
         imgActive: secondActive,
         name: classes.second,
         nameRus: 'купе',
         available: train?.have_second_class,
      },
      {
         id: 1,
         img: first,
         imgActive: firstActive,
         name: classes.first,
         nameRus: 'люкс',
         available: train?.have_first_class,
      },
   ];
   return (
      <div className={styles.coach}>
         <h4 className={styles.title}>Тип вагона</h4>
         <div className={styles.coachTypes}>
            {coachTypes.map(
               (coach) =>
                  coach?.available && (
                     <CoachTypeItem
                        key={coach?.id}
                        coach={coach}
                        direction={direction}
                     />
                  )
            )}
         </div>
      </div>
   );
}

CoachType.propTypes = {
   direction: PropTypes.string.isRequired,
};

export default CoachType;
