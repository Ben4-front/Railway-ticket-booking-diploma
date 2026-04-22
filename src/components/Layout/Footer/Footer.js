import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';

import useInput from '../../../hooks/useInput';

import styles from './Footer.module.scss';
import contacts from '../../../data/contacts';

import FooterTitle from './FooterTitle/FooterTitle';
import ContactItem from './ContactItem/ContactItem';
import SubscribeItems from './SubscribeItems/SubscribeItems';
import Logo from '../Logo/Logo';
import PopUp from '../../PopUp/PopUp';

import phone from './icons/contact-us/phone.svg';
import email from './icons/contact-us/email.svg';
import skype from './icons/contact-us/skype.svg';
import location from './icons/contact-us/location.svg';
import goUp from './icons/go-up.svg';

function Footer() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [sent, setSent] = useState(null);

   const { pathname } = useLocation();

   const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
   const isEmail = (value) => regex.test(value);

   const {
      value: emailValue,
      hasError: emailHasError,
      valueChangeHandler: emailChangeHandler,
      inputBlurHandler: emailBlurHandler,
      reset: resetEmail,
   } = useInput(isEmail);

   const submitHandler = async (evt) => {
      evt.preventDefault();

      if (!regex.test(emailValue)) {
         emailBlurHandler();
         return;
      }

      try {
         setError(null);
         setLoading(true);

         const response = await fetch(process.env.REACT_APP_SUBSCRIPTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailValue),
         });

         if (!response.ok) {
            throw new Error('Что-то пошло не так. Попробуйте еще раз');
         } else {
            resetEmail();
            setSent(true);
         }
      } catch (err) {
         setSent(false);
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   const contactUs = (
      <section id="contacts" className={styles.contact}>
         <FooterTitle text="Свяжитесь с нами" />
         <ul className={styles.contact__list}>
            <ContactItem icon={phone} alt="телефон">
               <a href={`tel:${contacts.phone}`}>{contacts.phoneDisplay}</a>
            </ContactItem>
            <ContactItem icon={email} alt="эл. почта">
               <a href={`mailto:${contacts.mail}`}>{contacts.mail}</a>
            </ContactItem>
            <ContactItem icon={skype} alt="скайп">
               <a href={`skype:${contacts.skype}`}>{contacts.skype}</a>
            </ContactItem>
            <ContactItem icon={location} alt="адрес">
               <div>
                  {contacts.city} <br />
                  {contacts.address} <br />
                  {contacts.office}
               </div>
            </ContactItem>
         </ul>
      </section>
   );

   const subscription = (
      <section className={styles.subscription}>
         <FooterTitle text="Подписка" />
         <h4 className={styles.subscription__subheader}>
            Будьте в курсе событий
         </h4>
         <div className={styles.subscription__inputGroup}>
            <input
               className={styles.inputGroup__input}
               type="email"
               placeholder="e-mail"
               value={emailValue}
               onChange={emailChangeHandler}
               onBlur={emailBlurHandler}
            />
            <button
               className={styles.inputGroup__btn}
               onClick={submitHandler}
               type="submit"
            >
               отправить
            </button>
         </div>
         {loading && <div className={styles.loading}>Идет загрузка</div>}
         {emailHasError && (
            <div className={styles.error}>Введите корректный e-mail</div>
         )}
      </section>
   );

   const subscribe = (
      <section className={styles.subscribe}>
         <FooterTitle text="Подписывайтесь на нас" />
         <SubscribeItems />
      </section>
   );

   const bottom = (
      <div className={styles.bottomNav}>
         <Logo />
         <HashLink smooth to={`${pathname}#header-navigation`}>
            <img
               className={styles.bottomNav__up}
               src={goUp}
               alt="кнопка перехода наверх"
            />
         </HashLink>
         <div className={styles.bottomNav__year}>2022 WEB</div>
      </div>
   );

   const popupSuccess = (
      <PopUp
         reason="info"
         message="Вы успешно подписались на рассылку, скоро отправим вам первое письмо:)"
      />
   );

   const popupFail = (
      <PopUp
         reason="error"
         message="Мы не смогли оформить подписку. Попробуйте еще раз"
      />
   );

   return (
      <footer className={styles.footer}>
         {sent && popupSuccess}
         {error && popupFail}
         <div className={styles.wrapper}>
            {contactUs}
            <div className={styles.middleWrapper}>
               {subscription}
               {subscribe}
            </div>
         </div>
         {bottom}
      </footer>
   );
}

export default Footer;
