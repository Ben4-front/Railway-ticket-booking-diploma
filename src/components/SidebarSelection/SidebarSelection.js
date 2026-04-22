import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Calendar from '../MainSearchBlock/Calendar/Calendar';
import Options from './Options/Options';
import PriceSlider from './PriceSlider/PriceSlider';
import OptionsDirection from './OptionsDirection/OptionsDirection';

import {
   selectDepartureDate,
   selectReturnDate,
} from '../../store/slices/searchSlice';
import { changeOffset, setCurrentPage } from '../../store/slices/sortSlice';
import { removeTrainData } from '../../store/slices/trainSlice';

import links from '../../data/links';

import date from './img/date.svg';

import to from './img/to.svg';
import back from './img/back.svg';

import consts from '../MainSearchBlock/consts';
import styles from './SidebarSelection.module.scss';

function SidebarSelection() {
   const title = useRef(document.createElement('section'));
   useEffect(() => {
      title.current.scrollIntoView({ behavior: 'smooth' });
   }, []);
   const { pathname } = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const departureDate = useSelector(selectDepartureDate);
   const returnDate = useSelector(selectReturnDate);
   const inpGrHeaderStyle = styles.section__header;
   const dateStyle = styles.date__input;
   const headerInvalidCl = `${inpGrHeaderStyle} ${styles['section__header-invalid']}`;

   const dateInvalidCl = `${dateStyle} ${styles['date__input-invalid']}`;
   const [inpGrHeaderDateClasses, setInpGrHeaderDateClasses] =
      useState(inpGrHeaderStyle);
   const [depDateClasses, setDepDateClasses] = useState(dateStyle);

   useEffect(() => {
      // если поля стали валидными - снимаем выделения

      if (departureDate) {
         setInpGrHeaderDateClasses(inpGrHeaderStyle);
         setDepDateClasses(dateStyle);
      } else {
         setInpGrHeaderDateClasses(headerInvalidCl);
         setDepDateClasses(dateInvalidCl);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [departureDate]);

   const onChangeOption = () => {
      dispatch(changeOffset(0));
      dispatch(setCurrentPage(1));
      dispatch(removeTrainData());

      if (pathname !== links.trains) {
         navigate(links.trains);
      }
   };

   return (
      <section className={styles.wrapper} ref={title}>
         <div className={styles.section}>
            <h4 className={inpGrHeaderDateClasses}> Дата поездки</h4>

            <div className={styles.date}>
               <Calendar name={consts.depDate} className={depDateClasses} />
               <div className={styles.date__icon}>
                  <img src={date} alt="иконка - календарь" />
               </div>
            </div>
            <h4 className={inpGrHeaderStyle}> Дата возвращения</h4>

            <div className={styles.date}>
               <Calendar name={consts.retDate} className={dateStyle} />
               <div className={styles.date__icon}>
                  <img src={date} alt="иконка - календарь" />
               </div>
            </div>
         </div>
         <div className={styles.section}>
            <Options onChangeOption={onChangeOption} />
         </div>
         <div className={styles.section}>
            <h4 className={styles.section__header}> Стоимость</h4>
            <PriceSlider onChangeOption={onChangeOption} />
         </div>
         <div className={styles.section}>
            <OptionsDirection
               onChangeOption={onChangeOption}
               direction="туда"
               name="to"
               img={to}
            />
         </div>
         {returnDate && (
            <div className={styles.section}>
               <OptionsDirection
                  onChangeOption={onChangeOption}
                  className={styles.section__header}
                  direction="обратно"
                  name="back"
                  img={back}
               />
            </div>
         )}
      </section>
   );
}

export default SidebarSelection;
