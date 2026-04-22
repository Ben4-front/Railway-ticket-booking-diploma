/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import { ConfigProvider } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';

import 'antd/es/date-picker/style/index';
import './Calendar.scss';

import consts from '../consts';
import links from '../../../data/links';

import {
   changeSearchFields,
   selectDepartureDate,
   selectReturnDate,
} from '../../../store/slices/searchSlice';
import { changeOffset, setCurrentPage } from '../../../store/slices/sortSlice';
import { removeTrainData } from '../../../store/slices/trainSlice';

require('dayjs/locale/ru');

dayjs.locale('ru');

const DatePicker = generatePicker(dayjsGenerateConfig);

function Calendar({ name, className }) {
   const { pathname } = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [selectedDate, setSelectedDate] = useState('');
   const departureDate = useSelector(selectDepartureDate);
   const returnDate = useSelector(selectReturnDate);

   useEffect(() => {
      if (name === consts.depDate) {
         setSelectedDate(departureDate ? dayjs(new Date(departureDate)) : '');
      }

      if (name === consts.retDate) {
         setSelectedDate(returnDate ? dayjs(new Date(returnDate)) : '');
      }
   }, [departureDate, returnDate, name]);

   let minDate = new Date();
   // максимум 100 дней от текущей даты
   let maxDate = new Date(dayjs(minDate).add(100, 'day').toJSON());
   if (name === consts.retDate && departureDate) {
      minDate = new Date(departureDate);
   }
   if (name === consts.depDate && returnDate) {
      maxDate = new Date(returnDate);
   }

   const disabledDate = (current) =>
      current && (current <= dayjs(minDate) || current >= dayjs(maxDate));

   const changeHandler = (date) => {
      setSelectedDate(date);
      dispatch(changeSearchFields({ name, value: dayjs(date).toJSON() }));
      dispatch(changeOffset(0));
      dispatch(setCurrentPage(1));
      dispatch(removeTrainData());
      if (pathname === links.seats) {
         navigate(links.trains);
      }
   };

   return (
      <ConfigProvider locale={ru_RU}>
         <DatePicker
            className={className}
            placeholder="дд/мм/гг"
            onChange={changeHandler}
            disabledDate={disabledDate}
            format="DD/MM/YY"
            allowClear
            showToday={false}
            value={selectedDate}
         />
      </ConfigProvider>
   );
}
Calendar.propTypes = {
   name: PropTypes.string.isRequired,
   className: PropTypes.node.isRequired,
};

export default Calendar;
