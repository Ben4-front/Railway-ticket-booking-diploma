import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import Layout from '../../components/Layout/Layout';
import AboutUs from '../../components/AboutUs/AboutUs';
import Reviews from '../../components/Reviews/Reviews';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import MainSearchBlock from '../../components/MainSearchBlock/MainSearchBlock';

import { removeOrderData } from '../../store/slices/orderSlice';

import widthOptions from '../../components/MainSearchBlock/widthOptions';
import picsOptions from '../../components/Layout/picsOptions';

import styles from './MainPage.module.scss';

function MainPage() {
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(removeOrderData());
   }, [dispatch]);

   const title = useRef(document.createElement('div'));
   useEffect(() => {
      title.current.scrollIntoView({ behavior: 'smooth' });
   }, []);

   const body = (
      <>
         <div id="about">
            <AboutUs />
         </div>
         <div id="how-it-works">
            <HowItWorks />
         </div>
         <div id="reviews">
            <Reviews />
         </div>
      </>
   );
   return (
      <Layout pic={picsOptions.main} body={body}>
         <div ref={title} className={styles.wrapper}>
            <h1 className={styles.title}>
               Вся жизнь -{' '}
               <span className={styles['title-bold']}>путешествие!</span>
            </h1>
            <MainSearchBlock width={widthOptions.regular} />
         </div>
      </Layout>
   );
}

export default MainPage;
