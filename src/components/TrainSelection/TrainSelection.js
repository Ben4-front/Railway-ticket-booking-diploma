import React from 'react';
import { useSelector } from 'react-redux';

import TrainCard from './TrainCard/TrainCard';

import {
   selectLoading,
   selectError,
   selectTrainsOptions,
} from '../../store/slices/trainsSlice';

import styles from './TrainSelection.module.scss';

function TrainSelection() {
   const loading = useSelector(selectLoading);
   const error = useSelector(selectError);
   const trainsOptions = useSelector(selectTrainsOptions);

   return (
      <section className={styles.trainSelection}>
         {error && <div>{error}</div>}
         {trainsOptions?.map((item) => (
            <TrainCard key={item.id} ticket={item.ticket} id={item.id} />
         ))}
         {(!trainsOptions || trainsOptions?.length < 1) && !loading && (
            <div className={styles.text}>
               Поезда не найдены. Выберите другую дату или маршрут
            </div>
         )}
      </section>
   );
}

export default TrainSelection;
