/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React, {
   useState,
   useRef,
   useEffect,
   useCallback,
   useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';

import ru_RU from 'antd/lib/locale/ru_RU';

import {
   Form,
   Select,
   Input,
   Checkbox,
   ConfigProvider,
   Radio,
   Button,
   InputNumber,
   Alert,
} from 'antd';

import { addPassengerId } from '../../../store/slices/seatsSlice';
import {
   addNewPassenger,
   editPassengerData,
   removePassenger,
   selectPassengers,
} from '../../../store/slices/passengersSlice';
import { selectSelectedCoaches } from '../../../store/slices/trainSlice';

import minusRound from '../img/minus-round.svg';
import cross from '../img/cross.svg';
import plusRound from '../img/plus-round.svg';

import passengerTypes from '../../SeatsSelection/SelectionBlock/passengerTypes';
import pasTypesRus from '../../SeatsSelection/SelectionBlock/pasTypesRus';
import docTypes from './docTypes';
import directions from '../../../data/directions';
import fieldNames from './fieldNames';
import rules from './rules';

import styles from './PassengerCard.module.scss';
import './PassengerCard.scss';
import links from '../../../data/links';

require('dayjs/locale/ru');

dayjs.locale('ru');

const DatePicker = generatePicker(dayjsGenerateConfig);

function PassengerCard({
   passengerType,
   pasNumber,
   clickOnRemovePassHandler,
   clickOnNextPassHandler,
   id,
   unchosenSeats,
   unchosenSeatsDep,
   unchosenSeatsArr,
}) {
   const dispatch = useDispatch();
   const thisPassenger = useSelector(selectPassengers).filter(
      (pas) => pas.id === id
   );
   const coaches = useSelector(selectSelectedCoaches);

   const [expanded, setExpanded] = useState(true);
   const [showError, setShowError] = useState(false);
   const [departureOnly, setDepartureOnly] = useState(!unchosenSeatsArr);
   const [disabledForwardBtn, setDisabledForwardBtn] = useState(false);
   const [form] = Form.useForm();
   const [documentType, setDocumentType] = useState(
      thisPassenger[0]?.documentType || passengerType === passengerTypes.adults
         ? docTypes.passport
         : docTypes.birthCertif
   );

   const unchosenSeatsAdults = unchosenSeats.filter(
      (el) => el.priceCoefficient === 1
   ).length;
   const unchosenSeatsChildren = unchosenSeats.filter(
      (el) => el.priceCoefficient === 0.5
   ).length;

   const [unchosenSeatsDepSourse, setUnchosenSeatsDepSourse] = useState(
      unchosenSeatsDep.filter(
         (el) =>
            el.priceCoefficient ===
            (passengerType === passengerTypes.adults ? 1 : 0.5)
      )
   );

   const [unchosenSeatsArrSourse, setUnchosenSeatsArrSourse] = useState(
      unchosenSeatsArr.length > 0 &&
         unchosenSeatsArr.filter(
            (el) =>
               el.priceCoefficient ===
               (passengerType === passengerTypes.adults ? 1 : 0.5)
         )
   );
   const [highAgeError, setHighAgeError] = useState(false);
   const [lowAgeError, setLowAgeError] = useState(false);

   const bottomSectionStyles = showError
      ? `${styles.passengerCard__bottom} ${styles['passengerCard__bottom-error']}`
      : styles.passengerCard__bottom;

   let initialValues = useMemo(
      () => ({
         passengerType,
         documentType:
            passengerType === passengerTypes.adults
               ? docTypes.passport
               : docTypes.birthCertif,
      }),
      [passengerType]
   );

   let seatInfo;

   if (thisPassenger.length > 0) {
      if (
         unchosenSeats.length === 0 &&
         !thisPassenger[0].seatArr &&
         !thisPassenger[0].seatDep
      ) {
         clickOnRemovePassHandler(id);
         dispatch(removePassenger(id));
      }
      if (thisPassenger[0].seatDep || thisPassenger[0].seatArr) {
         const allCoaches = [
            ...coaches[directions.departure],
            ...coaches[directions.arrival],
         ];
         const seatDepData = thisPassenger[0].seatDep?.split(':');
         const seatArrData = thisPassenger[0].seatArr?.split(':');

         const seatInfoMaker = (direction, seatData) => (
            <div>
               <span className={styles.seatDirection}>
                  {direction === directions.departure ? 'Туда' : 'Обратно'}
               </span>
               <span>
                  {` вагон: ${
                     allCoaches?.filter((el) => el.coachId === seatData[0])[0]
                        ?.name
                  }
                  , место: ${seatData[1]}`}
               </span>
            </div>
         );

         const oneWaySeatInfoMaker = (direction, seatData) => (
            <div>
               <div className={styles.seats}>Выбранное место</div>
               {seatInfoMaker(direction, seatData)}
            </div>
         );

         if (thisPassenger[0].seatDep && thisPassenger[0].seatArr) {
            seatInfo = (
               <div>
                  <div className={styles.seats}>Выбранные места</div>
                  {seatInfoMaker(directions.departure, seatDepData)}
                  {seatInfoMaker(directions.arrival, seatArrData)}
               </div>
            );
         } else if (thisPassenger[0].seatDep) {
            seatInfo = oneWaySeatInfoMaker(directions.departure, seatDepData);
         } else if (thisPassenger[0].seatArr) {
            seatInfo = oneWaySeatInfoMaker(directions.arrival, seatArrData);
         }
      }

      initialValues = {
         passengerType: thisPassenger[0].passengerType,
         firstName: thisPassenger[0].firstName,
         lastName: thisPassenger[0].lastName,
         fathersName: thisPassenger[0].fathersName,
         gender: thisPassenger[0].gender,
         documentType: thisPassenger[0].documentType,
      };

      if (thisPassenger[0].specialNeeds) {
         initialValues.specialNeeds = thisPassenger[0].specialNeeds;
      }

      if (thisPassenger[0].documentType === docTypes.passport) {
         initialValues.documentSerialNumber =
            thisPassenger[0].documentSerialNumber;
         initialValues.documentNumber = thisPassenger[0].documentNumber;
      }
      if (thisPassenger[0].documentType === docTypes.birthCertif) {
         initialValues.documentNumber = thisPassenger[0]?.documentNumber;
      }

      if (thisPassenger[0].departureOnly) {
         initialValues.departureOnly = thisPassenger[0].departureOnly;
      }

      if (thisPassenger[0].dateOfBirth) {
         const data = thisPassenger[0].dateOfBirth.split('.');
         initialValues.dateOfBirth = dayjs(`${data[1]}.${data[0]}.${data[2]}`);
      }
   }

   const seatsFilter = useCallback(
      (coef) => {
         setUnchosenSeatsDepSourse(
            unchosenSeatsDep.filter((el) => el.priceCoefficient === coef)
         );
         if (unchosenSeatsArr.length > 0 && !departureOnly) {
            setUnchosenSeatsArrSourse(
               unchosenSeatsArr.filter((el) => el.priceCoefficient === coef)
            );
         }
      },
      [departureOnly, unchosenSeatsArr, unchosenSeatsDep]
   );

   useEffect(() => {
      if (thisPassenger[0]?.documentType) {
         if (thisPassenger[0]?.documentType === docTypes.birthCertif) {
            setDocumentType(docTypes.birthCertif);

            seatsFilter(0.5);
         } else {
            setDocumentType(docTypes.passport);

            seatsFilter(1);
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const docTypeselectClasses =
      documentType === docTypes.passport
         ? 'passengerCard-doc-select-pass'
         : 'passengerCard-doc-select-birth-sertificate';

   const disabledDate = (current) => current && current > dayjs(new Date());

   const title = useRef(document.createElement('div'));
   useEffect(() => {
      title.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }, []);

   const dispatchMaker = (data, direct, idToSend = null) =>
      dispatch(
         addPassengerId({
            seat: Number(data.split(':')[1]),
            direction: direct,
            coachId: data.split(':')[0],
            passengerId: idToSend,
         })
      );

   const clickOnHeaderHandler = () => {
      setExpanded(!expanded);
   };

   const clickOnRemoveCardHandler = () => {
      if (form.getFieldValue(fieldNames.seatArr)) {
         dispatchMaker(
            form.getFieldValue(fieldNames.seatArr),
            directions.arrival
         );
      }

      if (form.getFieldValue(fieldNames.seatDep)) {
         dispatchMaker(
            form.getFieldValue(fieldNames.seatDep),
            directions.departure
         );
      }

      if (thisPassenger[0]?.seatArr) {
         dispatchMaker(thisPassenger[0].seatArr, directions.arrival);
      }

      if (thisPassenger[0]?.seatDep) {
         dispatchMaker(thisPassenger[0].seatDep, directions.departure);
      }

      dispatch(removePassenger(id));
      clickOnRemovePassHandler(id);
   };

   const onFinishFailed = () => {
      setShowError(true);
   };

   const onFinish = (values) => {
      if (!thisPassenger[0] && !disabledForwardBtn) {
         setHighAgeError(false);
         setLowAgeError(false);
         if (values.seatDep) {
            dispatchMaker(values.seatDep, directions.departure, id);
         }
         if (values.seatArr) {
            dispatchMaker(values.seatArr, directions.arrival, id);
         }

         dispatch(
            addNewPassenger({
               id,
               ...values,
               [fieldNames.dateOfBirth]:
                  values[fieldNames.dateOfBirth].format('DD.MM.YYYY'),
            })
         );

         if (
            unchosenSeatsDep.length - (values.seatDep ? 1 : 0) > 0 ||
            unchosenSeatsArr.length - (values.seatArr ? 1 : 0) > 0
         ) {
            clickOnNextPassHandler(id);
         }
      } else if (
         thisPassenger.length > 0 &&
         !thisPassenger[0]?.seatDep &&
         !thisPassenger[0]?.seatArr &&
         !disabledForwardBtn
      ) {
         if (values.seatDep) {
            dispatchMaker(values.seatDep, directions.departure, id);
         }
         if (values.seatArr) {
            dispatchMaker(values.seatArr, directions.arrival, id);
         }
         dispatch(
            editPassengerData({
               id,
               ...values,
               [fieldNames.dateOfBirth]:
                  values[fieldNames.dateOfBirth].format('DD.MM.YYYY'),
            })
         );
         if (
            unchosenSeatsDep.length - (values.seatDep ? 1 : 0) > 0 ||
            unchosenSeatsArr.length - (values.seatArr ? 1 : 0) > 0
         ) {
            clickOnNextPassHandler(id);
         }
      } else {
         dispatch(
            editPassengerData({
               id,
               ...values,
               [fieldNames.dateOfBirth]:
                  values[fieldNames.dateOfBirth].format('DD.MM.YYYY'),
            })
         );
      }
   };

   const fieldChangeHandler = (value) => {
      if (value[fieldNames.passengerType]) {
         const doc =
            value.passengerType === passengerTypes.adults
               ? docTypes.passport
               : docTypes.birthCertif;
         form.setFieldValue('documentType', doc);
         setDocumentType(doc);
         seatsFilter(
            Object.entries(value)[0][1] === passengerTypes.adults ? 1 : 0.5
         );
      }
      if (value[fieldNames.docType]) {
         setDocumentType(value[fieldNames.docType]);
      }

      setTimeout(() => {
         if (
            form.getFieldsError().filter((item) => item.errors.length > 0)
               .length === 0
         ) {
            setShowError(false);
         }
      }, 10);

      if (Object.entries(value)[0][0] === fieldNames.depOnly) {
         setDepartureOnly(Object.entries(value)[0][1]);

         if (form.getFieldValue(fieldNames.seatArr)) {
            dispatchMaker(
               form.getFieldValue(fieldNames.seatArr),
               directions.arrival
            );
            form.setFieldValue(fieldNames.seatArr, null);
         }
      }

      if (
         (value.passengerType || value.dateOfBirth) &&
         thisPassenger.length <= 0
      ) {
         setHighAgeError(false);
         setLowAgeError(false);
         setDisabledForwardBtn(false);

         const ageYears = dayjs().diff(
            form.getFieldValue(fieldNames.dateOfBirth),
            'years'
         );
         const ageChosen =
            dayjs().diff(form.getFieldValue(fieldNames.dateOfBirth), 'days') >=
            1;

         if (ageChosen) {
            const pasType = form.getFieldValue(fieldNames.passengerType);
            if (ageYears < 10 && pasType === passengerTypes.adults) {
               setLowAgeError(true);
               form.setFieldValue(
                  fieldNames.passengerType,
                  passengerTypes.children
               );
               seatsFilter(0.5);
            }

            if (ageYears >= 10 && pasType === passengerTypes.children) {
               setHighAgeError(true);
               form.setFieldValue(
                  fieldNames.passengerType,
                  passengerTypes.adults
               );
               seatsFilter(1);
            }

            if (ageYears >= 14) {
               form.setFieldValue(fieldNames.docType, docTypes.passport);
               setDocumentType(docTypes.passport);
               seatsFilter(1);
            }

            if (
               ageYears < 14 &&
               form.getFieldValue(fieldNames.docType) !== docTypes.birthCertif
            ) {
               form.setFieldValue(fieldNames.docType, docTypes.birthCertif);
               setDocumentType(docTypes.birthCertif);
            }
         }
      }
   };

   const alertMaker = (age) => (
      <Alert
         className={styles.row}
         message={
            age === 'high'
               ? 'Детские билеты доступны только для пассажиров до 10 лет'
               : 'Для пассажиров до 10 лет действует детский тариф'
         }
         type="warning"
      />
   );

   const passengerCardClosed = (
      <button
         type="button"
         onClick={clickOnHeaderHandler}
         className={styles.closedPassengerCard}
      >
         <img src={plusRound} alt="иконка - плюс" />
         <span className={styles.text}>Пассажир {pasNumber}</span>
      </button>
   );

   const passType = (
      <Form.Item
         name={fieldNames.passengerType}
         value={form.passengerType}
         rules={rules.passengerType}
      >
         <Select
            className="passengerCard-select"
            popupClassName="passengerCard-select"
         >
            {unchosenSeatsAdults && (
               <Select.Option value={passengerTypes.adults}>
                  {pasTypesRus[passengerTypes.adults]}
               </Select.Option>
            )}
            {unchosenSeatsChildren && (
               <Select.Option value={passengerTypes.children}>
                  {pasTypesRus[passengerTypes.children]}
               </Select.Option>
            )}
         </Select>
      </Form.Item>
   );

   const pasTypeToDisplay = (
      <div>
         {thisPassenger[0]?.passengerType === passengerTypes.adults
            ? pasTypesRus[passengerTypes.adults]
            : thisPassenger[0]?.passengerType === passengerTypes.children
            ? pasTypesRus[passengerTypes.children]
            : 'Тип неопределен'}
      </div>
   );

   const onChangeFullName = (evt) => {
      form.setFieldValue(evt.target.id, evt.target.value.toLowerCase());
   };

   const fullNameInputFields = (
      <>
         <Form.Item
            name={fieldNames.lastName}
            label={fieldNames.lastNameLabel}
            rules={rules.lastName}
            onChange={onChangeFullName}
         >
            <Input
               className={`${styles.inputField} passengerCard-input`}
               allowClear
            />
         </Form.Item>
         <Form.Item
            name={fieldNames.firstName}
            label={fieldNames.firstNameLabel}
            rules={rules.firstName}
            onChange={onChangeFullName}
         >
            <Input
               className={`${styles.inputField} passengerCard-input`}
               allowClear
            />
         </Form.Item>
         <Form.Item
            name={fieldNames.fathersName}
            label={fieldNames.fathersNameLabel}
            rules={rules.fathersName}
            onChange={onChangeFullName}
         >
            <Input
               className={`${styles.inputField} passengerCard-input`}
               allowClear
            />
         </Form.Item>
      </>
   );

   const sexRadioGroup = (
      <Form.Item
         label={fieldNames.genderLabel}
         name={fieldNames.gender}
         className={styles.genderRadioBtn}
         rules={rules.gender}
      >
         <Radio.Group
            optionType="button"
            buttonStyle="solid"
            className="passengerCard-radio"
         >
            <Radio.Button value="true" defaultChecked>
               М
            </Radio.Button>
            <Radio.Button value="false">Ж</Radio.Button>
         </Radio.Group>
      </Form.Item>
   );

   const dateOfBirthPicker = (
      <ConfigProvider locale={ru_RU}>
         <Form.Item
            label={fieldNames.dateOfBirthLabel}
            name={fieldNames.dateOfBirth}
            rules={rules.dateOfBirth}
            value={form.dateOfBirth}
         >
            <DatePicker
               className="passengerCard-datepicker"
               popupClassName="passengerCard-datepicker"
               placeholder="дд/мм/гг"
               disabledDate={disabledDate}
               format="DD.MM.YYYY"
               allowClear
               showToday={false}
            />
         </Form.Item>
      </ConfigProvider>
   );

   const specialNeedsCheckbox = (
      <Form.Item valuePropName="checked" name={fieldNames.specialNeeds}>
         <Checkbox className="passengerCard-checkbox">
            {fieldNames.specialNeedsLabel}
         </Checkbox>
      </Form.Item>
   );

   const docTypeSelect = (
      <Form.Item
         label={fieldNames.docTypeLabel}
         name={fieldNames.docType}
         className={styles.documentType}
         rules={rules.docType}
      >
         <Select
            className={docTypeselectClasses}
            popupClassName="passengerCard-doc-select"
            showArrow
            allowClear={false}
         >
            {(dayjs().diff(
               form.getFieldValue(fieldNames.dateOfBirth),
               'years'
            ) >= 14 ||
               dayjs().diff(
                  form.getFieldValue(fieldNames.dateOfBirth),
                  'days'
               ) <= 0) && (
               <Select.Option value={docTypes.passport}>
                  {docTypes.passportRus}
               </Select.Option>
            )}
            <Select.Option value={docTypes.birthCertif}>
               {docTypes.birthCertifRus}
            </Select.Option>
         </Select>
      </Form.Item>
   );

   const passSerNum = (
      <Form.Item
         label={fieldNames.docSerialNumberLabel}
         name={fieldNames.docSerialNumber}
         className={styles.documentType}
         rules={rules.docSerialNumber}
      >
         <InputNumber
            placeholder="_ _ _ _"
            className={styles.inputFieldPassport}
            controls={false}
         />
      </Form.Item>
   );

   const passNum = (
      <Form.Item
         label={fieldNames.docNumberPassLabel}
         name={fieldNames.docNumberPass}
         className={styles.documentType}
         rules={rules.docNumberPass}
      >
         <InputNumber
            placeholder="_ _ _ _ _ _"
            className={styles.inputFieldPassport}
            controls={false}
         />
      </Form.Item>
   );

   const birthCertif = (
      <Form.Item
         label={fieldNames.docNumberSertifLabel}
         name={fieldNames.docNumberSertif}
         className={styles.documentType}
         rules={rules.docNumberSertif}
      >
         <Input
            placeholder="12 символов"
            className={styles.inputFieldBirthSertif}
         />
      </Form.Item>
   );

   const seatDep = (
      <Form.Item
         label={fieldNames.seatDepLabel}
         name={fieldNames.seatDep}
         className={styles.documentType}
         rules={rules.seatDep}
      >
         <Select
            className="passengerCard-seat-select"
            showArrow
            allowClear={false}
         >
            {unchosenSeatsDepSourse?.map((item) => (
               <Select.Option
                  key={`${item.coachId}:${item.seat}`}
                  value={`${item.coachId}:${item.seat}`}
               >
                  {` Вагон: ${item.coachName}, место: ${item.seat}`}
               </Select.Option>
            ))}
         </Select>
      </Form.Item>
   );

   const depOnly = (
      <Form.Item
         className={`${styles.departureOnly} passengerCard-checkbox-departureOnly`}
         valuePropName="checked"
         name={fieldNames.depOnly}
         label={fieldNames.depOnlyLabel}
      >
         <Checkbox className="passengerCard-checkbox-departureOnly" />
      </Form.Item>
   );

   const seatArr = (
      <Form.Item
         label={fieldNames.seatArrLabel}
         name={fieldNames.seatArr}
         className={styles.documentType}
         rules={rules.seatArr}
      >
         {unchosenSeatsArrSourse.length > 0 && (
            <Select
               className="passengerCard-seat-select"
               showArrow
               allowClear={false}
            >
               {unchosenSeatsArrSourse.length > 0 &&
                  unchosenSeatsArrSourse?.map((item) => (
                     <Select.Option
                        key={`${item.coachId}:${item.seat}`}
                        value={`${item.coachId}:${item.seat}`}
                     >
                        {` Вагон: ${item.coachName}, место: ${item.seat}`}
                     </Select.Option>
                  ))}
            </Select>
         )}
      </Form.Item>
   );

   const seatSelection = (
      <>
         {unchosenSeatsDepSourse.length > 0 && seatDep}

         {unchosenSeatsArrSourse.length > 0 &&
            unchosenSeatsDepSourse.length > 0 &&
            depOnly}

         {unchosenSeatsArrSourse.length > 0 && !departureOnly && seatArr}
      </>
   );

   const linkToSeatsPage = (
      <Link to={links.seats}>
         <span className={styles.link}>страницу выбора мест</span>
      </Link>
   );

   const needMoreSeatsText = (
      <div>
         <span>{`Нужен еще один
         ${
            form.getFieldValue(fieldNames.passengerType) ===
            passengerTypes.adults
               ? pasTypesRus[passengerTypes.adults].toLowerCase()
               : pasTypesRus[passengerTypes.children].toLowerCase()
         } билет? Пожалуйста, вернитесь на `}</span>
         <span> {linkToSeatsPage}</span>
         <span> и выберите дополнительное место на схеме вагона</span>
      </div>
   );

   useEffect(() => {
      if (
         !thisPassenger.length > 0 &&
         !unchosenSeatsDepSourse.length > 0 &&
         !unchosenSeatsArrSourse.length > 0
      ) {
         setDisabledForwardBtn(true);
      }
   }, [
      thisPassenger.length,
      unchosenSeatsArrSourse.length,
      unchosenSeatsDepSourse.length,
   ]);

   const seatSelBlock = (
      <div className={`${styles.row} ${styles.rowSeats}`}>
         {((!thisPassenger.length > 0 &&
            (unchosenSeatsDepSourse.length > 0 ||
               unchosenSeatsArrSourse.length > 0)) ||
            (thisPassenger.length > 0 &&
               !thisPassenger[0].seatDep &&
               !thisPassenger[0].seatArr)) &&
            seatSelection}
         {!thisPassenger.length > 0 &&
            !unchosenSeatsDepSourse.length > 0 &&
            !unchosenSeatsArrSourse.length > 0 &&
            needMoreSeatsText}
         {thisPassenger.length > 0 &&
            (thisPassenger[0].seatDep || thisPassenger[0].seatArr) && (
               <div>{seatInfo}</div>
            )}
         {/* {thisPassenger.length > 0 &&
            !thisPassenger[0].seatDep &&
            !thisPassenger[0].seatArr && <div>12343</div>} */}
      </div>
   );

   const button = (
      <Form.Item className={bottomSectionStyles}>
         {!thisPassenger[0] && !disabledForwardBtn && (
            <Button
               type="primary"
               htmlType="submit"
               className="passengerCard__button"
               disabled={disabledForwardBtn}
            >
               Следующий пассажир
            </Button>
         )}
         {thisPassenger[0] && (
            <button type="submit" className={styles.changeButton}>
               Изменить
            </button>
         )}
      </Form.Item>
   );

   return (
      <div id={id} ref={title}>
         {!expanded && passengerCardClosed}
         {expanded && (
            <div className={styles.passengerCard}>
               <div
                  tabIndex="0"
                  role="button"
                  className={`${styles.passengerCard__header} ${styles.section}`}
                  onClick={clickOnHeaderHandler}
               >
                  <div className={styles.left}>
                     <img src={minusRound} alt="иконка - минус" />
                     <span className={styles.text}>Пассажир {pasNumber}</span>
                  </div>
                  <button type="button" onClick={clickOnRemoveCardHandler}>
                     <img src={cross} alt="иконка - крестик" />
                  </button>
               </div>

               <Form
                  form={form}
                  initialValues={initialValues}
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  onValuesChange={fieldChangeHandler}
                  scrollToFirstError
               >
                  <div className={styles.section}>
                     <div className={styles.row}>
                        {!thisPassenger[0] && passType}
                        {thisPassenger[0] && pasTypeToDisplay}
                     </div>
                     <div className={styles.row}>{fullNameInputFields}</div>
                     <div className={`${styles.row} ${styles.rowShort}`}>
                        {sexRadioGroup}
                        {dateOfBirthPicker}
                     </div>
                     {highAgeError && alertMaker('high')}
                     {lowAgeError && alertMaker('low')}
                     <div className={styles.row}>{specialNeedsCheckbox}</div>
                  </div>
                  <div className={styles.section}>
                     <div className={`${styles.row} ${styles.rowShort}`}>
                        {docTypeSelect}
                        {documentType === docTypes.passport && passSerNum}
                        {documentType === docTypes.passport && passNum}
                        {documentType === docTypes.birthCertif && birthCertif}
                     </div>
                  </div>
                  <div className={styles.section}>{seatSelBlock}</div>
                  {((!thisPassenger[0] && !disabledForwardBtn) ||
                     thisPassenger[0]) &&
                     button}
               </Form>
            </div>
         )}
      </div>
   );
}

const shapedObj = {
   coachId: PropTypes.string.isRequired,
   coachName: PropTypes.string.isRequired,
   passengerId: PropTypes.string,
   price: PropTypes.number.isRequired,
   priceCoefficient: PropTypes.number.isRequired,
   seat: PropTypes.number.isRequired,
};

PassengerCard.propTypes = {
   passengerType: PropTypes.string.isRequired,
   pasNumber: PropTypes.number.isRequired,
   clickOnRemovePassHandler: PropTypes.func.isRequired,
   clickOnNextPassHandler: PropTypes.func.isRequired,
   id: PropTypes.string.isRequired,
   unchosenSeats: PropTypes.arrayOf(PropTypes.shape(shapedObj)).isRequired,
   unchosenSeatsDep: PropTypes.arrayOf(PropTypes.shape(shapedObj)).isRequired,
   unchosenSeatsArr: PropTypes.arrayOf(PropTypes.shape(shapedObj)),
};

PassengerCard.defaultProps = {
   unchosenSeatsArr: null,
};

export default PassengerCard;
