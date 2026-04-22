import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Input, InputNumber, Radio } from 'antd';

import {
   addPersonalData,
   selectPersonalData,
} from '../../store/slices/personalDataSlice';
import { selectPassengers } from '../../store/slices/passengersSlice';

import links from '../../data/links';
import fieldNames from './fieldNames';
import rules from './rules';
import paymentTypes from './paymentTypes';

import styles from './PaymentOptions.module.scss';
import './PaymentOptions.scss';
import passengerTypes from '../SeatsSelection/SelectionBlock/passengerTypes';

function PaymentOptions() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [form] = Form.useForm();

   const personalData = useSelector(selectPersonalData);
   const passengers = useSelector(selectPassengers);
   const firstAdult = passengers?.find(
      (pas) => pas.passengerType === passengerTypes.adults
   );
   let initialValues;

   if (personalData[fieldNames.firstName]) {
      initialValues = personalData;
   }

   if (
      !personalData[fieldNames.firstName] &&
      firstAdult[fieldNames.firstName]
   ) {
      initialValues = {
         [fieldNames.lastName]: firstAdult[fieldNames.lastName],
         [fieldNames.firstName]: firstAdult[fieldNames.firstName],
         [fieldNames.fathersName]: firstAdult[fieldNames.fathersName],
      };
   }

   const onChangeFullName = (evt) => {
      form.setFieldValue(evt.target.id, evt.target.value.toLowerCase());
   };

   const clickHandler = () => {
      form.validateFields().then((values) => {
         dispatch(addPersonalData(values));
         navigate(links.confirmOrder);
      });
      // .catch((errorInfo) => {
      //    console.log(errorInfo);
      // });
   };

   const fullForm = (
      <section className={styles.card}>
         <Form
            form={form}
            layout="vertical"
            scrollToFirstError
            initialValues={initialValues}
         >
            <div className={`${styles.header} ${styles.section}`}>
               <span className={styles.text}>Персональные данные</span>
            </div>
            <div className={styles.section}>
               <div className={styles.row}>
                  <Form.Item
                     className="paymentOption"
                     name={fieldNames.lastName}
                     label={fieldNames.lastNameLabel}
                     rules={rules.lastName}
                     onChange={onChangeFullName}
                  >
                     <Input
                        className={`${styles.inputField} ${styles.fullName} passengerCard-input`}
                        allowClear
                     />
                  </Form.Item>
                  <Form.Item
                     className="paymentOption"
                     name={fieldNames.firstName}
                     label={fieldNames.firstNameLabel}
                     rules={rules.firstName}
                     onChange={onChangeFullName}
                  >
                     <Input
                        className={`${styles.inputField} ${styles.fullName} passengerCard-input`}
                        allowClear
                     />
                  </Form.Item>
                  <Form.Item
                     className="paymentOption"
                     name={fieldNames.fathersName}
                     label={fieldNames.fathersNameLabel}
                     rules={rules.fathersName}
                     onChange={onChangeFullName}
                  >
                     <Input
                        className={`${styles.inputField} ${styles.fullName} passengerCard-input`}
                        allowClear
                     />
                  </Form.Item>
               </div>

               <div className={styles.rowShort}>
                  <Form.Item
                     className="paymentOption"
                     name={fieldNames.phone}
                     label={fieldNames.phoneLabel}
                     rules={rules.phone}
                  >
                     <InputNumber
                        className={styles.inputField}
                        prefix="+7"
                        placeholder="_ _ _  _ _ _  _ _  _ _"
                        controls={false}
                     />
                  </Form.Item>
               </div>

               <div className={styles.rowShort}>
                  <Form.Item
                     className="paymentOption"
                     name={fieldNames.email}
                     label={fieldNames.emailLabel}
                     rules={rules.email}
                     onChange={onChangeFullName}
                  >
                     <Input
                        placeholder="inbox@gmail.com"
                        className={styles.inputField}
                     />
                  </Form.Item>
               </div>
            </div>

            <div className={`${styles.header} ${styles.section}`}>
               <span className={styles.text}>
                  {fieldNames.paymentMethodLabel}
               </span>
            </div>
            <Form.Item
               name={fieldNames.paymentMethod}
               rules={rules.paymentMethod}
            >
               <Radio.Group className={styles.radioGroup}>
                  <div className={styles.section}>
                     <Radio
                        className={` ${styles.radioRow} radioRow`}
                        value={paymentTypes.onlineEng}
                     >
                        {paymentTypes.online}
                        <div className={styles.onlinePayments}>
                           <div className={styles.paymentMethod}>
                              {paymentTypes.card}
                           </div>
                           <div className={styles.paymentMethod}>
                              {paymentTypes.payPal}
                           </div>
                           <div className={styles.paymentMethod}>
                              {paymentTypes.visa}
                           </div>
                        </div>
                     </Radio>
                  </div>
                  <div className={styles.section}>
                     <Radio
                        value={paymentTypes.cashEng}
                        className={` ${styles.radioRow} radioRow`}
                     >
                        {paymentTypes.cash}
                     </Radio>
                  </div>
               </Radio.Group>
            </Form.Item>
         </Form>
      </section>
   );

   const button = (
      <div className={styles.buttonWrapper}>
         <button onClick={clickHandler} type="submit">
            купить билеты
         </button>
      </div>
   );

   return (
      <>
         {fullForm}
         {button}
      </>
   );
}

export default PaymentOptions;
