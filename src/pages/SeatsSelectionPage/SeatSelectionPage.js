import React from 'react';
import { useSelector } from 'react-redux';

import Layout from '../../components/Layout/Layout';
import SidebarSelection from '../../components/SidebarSelection/SidebarSelection';
import MainSearchBlock from '../../components/MainSearchBlock/MainSearchBlock';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import LastTickets from '../../components/LastTickets/LastTickets';
import SeatsSelection from '../../components/SeatsSelection/SeatsSelection';
import Redirect from '../../components/Redirect/Redirect';

import { selectIndex } from '../../store/slices/trainSlice';

import widthOptions from '../../components/MainSearchBlock/widthOptions';
import picsOptions from '../../components/Layout/picsOptions';

import styles from './SeatsSelectionPage.module.scss';

function SeatsSelectionPage() {
   const selectedTrainIndex = useSelector(selectIndex);

   let midBody;
   if (selectedTrainIndex !== null) {
      midBody = (
         <>
            <div>
               <SidebarSelection />
               <LastTickets />
            </div>
            <div className={styles['wrapper-main']}>
               <SeatsSelection />
            </div>
         </>
      );
   } else {
      midBody = <Redirect />;
   }
   const body = (
      <>
         <ProgressBar step={1} />
         <div className={styles.body}>{midBody}</div>
      </>
   );
   return (
      <Layout pic={picsOptions.search} body={body}>
         <MainSearchBlock width={widthOptions.wide} />
      </Layout>
   );
}

export default SeatsSelectionPage;
