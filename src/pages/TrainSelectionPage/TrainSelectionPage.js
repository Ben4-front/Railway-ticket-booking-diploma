import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import dayjs from 'dayjs';

import Layout from '../../components/Layout/Layout';
import SidebarSelection from '../../components/SidebarSelection/SidebarSelection';
import MainSearchBlock from '../../components/MainSearchBlock/MainSearchBlock';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import LastTickets from '../../components/LastTickets/LastTickets';
import Filters from '../../components/TrainSelection/Filters/Filters';
import TrainSelection from '../../components/TrainSelection/TrainSelection';
import PaginationItem from '../../components/TrainSelection/Pagination/Pagination';
import LoadingAnimation from '../../components/TrainSelection/LoadingAnimation/LoadingAnimation';

import {
   fetchTrainsOptions,
   fetchLastTickets,
} from '../../store/thunks/asyncThunks';

import {
   selectSort,
   selectLimit,
   selectOffset,
   selectCurrentPage,
   changeOffset,
   setCurrentPage,
} from '../../store/slices/sortSlice';
import {
   selectDepartureCity,
   selectArrivalCity,
   selectDepartureDate,
   selectReturnDate,
} from '../../store/slices/searchSlice';
import {
   selectOptions,
   selectPrices,
   selectTime,
} from '../../store/slices/sidebarSelectSlice';
import {
   selectTotalCount,
   selectLoading as selectLoadingTrains,
} from '../../store/slices/trainsSlice';
import { selectLoading as selectLoadingLastTickets } from '../../store/slices/lastTicketsSlice';
import { removeTrainData } from '../../store/slices/trainSlice';
import { removeSeatsData } from '../../store/slices/seatsSlice';
import { removeSeatInfo } from '../../store/slices/passengersSlice';

import widthOptions from '../../components/MainSearchBlock/widthOptions';
import picsOptions from '../../components/Layout/picsOptions';

import styles from './TrainSelectionPage.module.scss';

function TrainSelectionPage() {
   const dispatch = useDispatch();
   const limit = useSelector(selectLimit);
   const sort = useSelector(selectSort);
   const offset = useSelector(selectOffset);
   const total = useSelector(selectTotalCount);
   const currentPage = useSelector(selectCurrentPage);
   const departureCity = useSelector(selectDepartureCity);
   const arrivalCity = useSelector(selectArrivalCity);
   const departureDate = useSelector(selectDepartureDate);
   const returnDate = useSelector(selectReturnDate);
   const options = useSelector(selectOptions);
   const prices = useSelector(selectPrices);
   const time = useSelector(selectTime);
   const loadingTrains = useSelector(selectLoadingTrains);
   const loadingLastTickets = useSelector(selectLoadingLastTickets);

   // базово направление туда и обратно, время туда и обратно, цена, сортировка, лимит на стр
   let url = useMemo(
      () => `${process.env.REACT_APP_TICKETS}from_city_id=${
         departureCity.id
      }&to_city_id=${arrivalCity.id}&date_start=${dayjs(departureDate).format(
         'YYYY-MM-DD'
      )}&start_departure_hour_from=${Math.floor(
         time.to.departure.min / 60
      )}&start_departure_hour_to=${Math.floor(
         time.to.departure.max / 60
      )}&start_arrival_hour_from=${Math.floor(
         time.to.arrival.min / 60
      )}&start_arrival_hour_to=${Math.floor(time.to.arrival.max / 60)}
   &price_from=${prices.min}&sort=${
         sort.value
      }&limit=${limit}&offset=${offset}`,
      [
         arrivalCity.id,
         departureCity.id,
         departureDate,
         limit,
         offset,
         prices.min,
         sort.value,
         time.to.arrival.max,
         time.to.arrival.min,
         time.to.departure.max,
         time.to.departure.min,
      ]
   );

   // опциональные параметры
   if (returnDate) {
      url += `&date_end=${dayjs(returnDate).format(
         'YYYY-MM-DD'
      )}&end_departure_hour_from=${Math.floor(
         time.back.departure.min / 60
      )}&end_departure_hour_to=${Math.floor(
         time.back.departure.max / 60
      )}&end_arrival_hour_from=${Math.floor(
         time.back.arrival.min / 60
      )}&end_arrival_hour_to=${Math.floor(time.back.arrival.max / 60)}`;
   }
   if (options.firstClass) {
      url += '&have_first_class=true';
   }
   if (options.secondClass) {
      url += '&have_second_class=true';
   }
   if (options.thirdClass) {
      url += '&have_third_class=true';
   }
   if (options.fourthClass) {
      url += '&have_fourth_class=true';
   }
   if (options.wifi) {
      url += '&have_wifi=true';
   }
   if (options.express) {
      url += '&is_express=true';
   }
   if (prices.max) {
      url += `&price_to=${prices.max}`;
   }

   useEffect(() => {
      dispatch(fetchTrainsOptions(url));
   }, [dispatch, url]);

   useEffect(() => {
      dispatch(removeTrainData());
      dispatch(removeSeatsData());
      dispatch(removeSeatInfo());
      dispatch(fetchLastTickets(process.env.REACT_APP_LAST_TICKETS));
   }, [dispatch]);

   const onChangePage = (value) => {
      dispatch(setCurrentPage(value));
      dispatch(changeOffset(value * limit - limit));
   };
   const body = (
      <>
         <ProgressBar step={1} />
         {loadingTrains && <LoadingAnimation />}
         {!loadingTrains && !loadingLastTickets && (
            <div className={styles.body}>
               <div>
                  <SidebarSelection />
                  <LastTickets />
               </div>
               <div className={styles['wrapper-main']}>
                  <Filters />
                  <TrainSelection />
                  <PaginationItem
                     current={currentPage}
                     onChange={onChangePage}
                     total={total}
                     pageSize={limit}
                  />
               </div>
            </div>
         )}
      </>
   );
   return (
      <Layout pic={picsOptions.search} body={body}>
         <MainSearchBlock width={widthOptions.wide} />
      </Layout>
   );
}

export default TrainSelectionPage;
