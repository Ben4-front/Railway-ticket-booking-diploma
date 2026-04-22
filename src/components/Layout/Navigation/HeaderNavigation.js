import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';

import Logo from '../Logo/Logo';

import links from '../../../data/links';

import styles from './HeaderNavigation.module.scss';

function HeaderNavigation() {
   const { pathname } = useLocation();
   return (
      <nav id="header-navigation">
         <Logo />
         <ul className={styles['nav-bar']}>
            <li className={styles['nav-bar__link']}>
               <HashLink smooth to={`${links.main}/#about`}>
                  <div>О нас</div>
               </HashLink>
            </li>
            <li className={styles['nav-bar__link']}>
               <HashLink smooth to={`${links.main}/#how-it-works`}>
                  <div>Как это работает</div>
               </HashLink>
            </li>
            <li className={styles['nav-bar__link']}>
               <HashLink smooth to={`${links.main}/#reviews`}>
                  <div>Отзывы</div>
               </HashLink>
            </li>
            <li className={styles['nav-bar__link']}>
               <HashLink smooth to={`${pathname}/#contacts`}>
                  <div>Контакты</div>
               </HashLink>
            </li>
         </ul>
      </nav>
   );
}

export default HeaderNavigation;
