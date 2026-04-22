import React from 'react';
import { useSelector } from 'react-redux';

import Layout from '../../components/Layout/Layout';
import OrderSuccess from '../../components/OrderSuccess/OrderSuccess';
import Redirect from '../../components/Redirect/Redirect';

import {
   selectOrderNumber,
   selectSum,
   selectName,
} from '../../store/slices/orderSlice';

import picsOptions from '../../components/Layout/picsOptions';

import styles from './SuccessfulOrderPage.module.scss';

function SuccessfulOrderPage() {
   const orderNumber = useSelector(selectOrderNumber);
   const sum = useSelector(selectSum);
   const name = useSelector(selectName);

   const body = (
      <div className={styles.body}>
         {orderNumber && sum && name && <OrderSuccess />}
         {(!orderNumber || !sum || !name) && <Redirect />}
      </div>
   );
   return <Layout pic={picsOptions.success} body={body} />;
}

export default SuccessfulOrderPage;
