import React from 'react';
import { useSelector } from 'react-redux';

import Layout from '../../components/Layout/Layout';
import MainSearchBlock from '../../components/MainSearchBlock/MainSearchBlock';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import SidebarDetails from '../../components/SidebarDetails/SidebarDetails';
import OrderConfirmation from '../../components/OrderConfirmation/OrderConfirmation';
import Redirect from '../../components/Redirect/Redirect';

import { selectSelectedSeats } from '../../store/slices/seatsSlice';
import { selectIndex } from '../../store/slices/trainSlice';
import { selectPassengers } from '../../store/slices/passengersSlice';
import { selectPersonalData } from '../../store/slices/personalDataSlice';

import widthOptions from '../../components/MainSearchBlock/widthOptions';
import picsOptions from '../../components/Layout/picsOptions';
import directions from '../../data/directions';
import fieldNames from '../../components/PaymentOptions/fieldNames';

import styles from './OrderConfirmationPage.module.scss';

function OrderConfirmationPage() {
   const seatsDep = useSelector(selectSelectedSeats)[directions.departure];
   const seatsArr = useSelector(selectSelectedSeats)[directions.arrival];
   const selectedTrainIndex = useSelector(selectIndex);
   const passengers = useSelector(selectPassengers);
   const paymentOption =
      useSelector(selectPersonalData)[fieldNames.paymentMethod];

   let midBody;
   if (
      (seatsDep.length > 0 || seatsArr.length > 0) &&
      selectedTrainIndex !== null &&
      passengers.length > 0 &&
      paymentOption
   ) {
      midBody = (
         <>
            <div>
               <SidebarDetails />
            </div>
            <div className={styles['wrapper-main']}>
               <OrderConfirmation />
            </div>
         </>
      );
   } else {
      midBody = <Redirect />;
   }

   const body = (
      <>
         <ProgressBar step={4} />
         <div className={styles.body}>{midBody}</div>
      </>
   );

   return (
      <Layout pic={picsOptions.search} body={body}>
         <MainSearchBlock width={widthOptions.wide} />
      </Layout>
   );
}

export default OrderConfirmationPage;
