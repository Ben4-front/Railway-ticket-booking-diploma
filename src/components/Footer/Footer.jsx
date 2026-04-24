import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { postSubscription, resetSubscription } from '../../store/slices/subscribeSlice';
import './Footer.css';
import phoneIcon from '../../assets/icons/phone.svg'; // Вам нужно будет добавить свои иконки
import emailIcon from '../../assets/icons/email.svg';
import skypeIcon from '../../assets/icons/skype.svg';
import locationIcon from '../../assets/icons/location.svg';

export default function Footer() {
    const dispatch = useDispatch();
    const { status, message } = useSelector(state => state.subscribe);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        dispatch(postSubscription(data.email)).then(() => {
            // Очищаем форму и сообщение через 3 секунды
            setTimeout(() => {
                reset();
                dispatch(resetSubscription());
            }, 3000);
        });
    };

    return (
        <footer className="footer" id="contacts">
            <div className="footer__container">
                <div className="footer__contacts">
                    <h3 className="footer__title">Свяжитесь с нами</h3>
                    <ul className="contact-list">
                        <li><img src={phoneIcon} alt="Телефон" /> 8 (800) 000 00 00</li>
                        <li><img src={emailIcon} alt="Email" /> inbox@mail.ru</li>
                        <li><img src={skypeIcon} alt="Skype" /> tu.train.tickets</li>
                        <li><img src={locationIcon} alt="Адрес" /> г. Москва, ул. Московская 27-35, 555 555</li>
                    </ul>
                </div>

                <div className="footer__subscribe">
                    <h3 className="footer__title">Подписка</h3>
                    <p>Будьте в курсе событий</p>
                    <form className="subscribe-form" onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="email"
                            placeholder="e-mail"
                            {...register('email', {
                                required: 'Это поле обязательно',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Неверный формат e-mail'
                                }
                            })}
                        />
                        <button type="submit" disabled={status === 'pending'}>
                            Отправить
                        </button>
                    </form>
                    {errors.email && <p className="subscribe-error">{errors.email.message}</p>}
                    {message && <p className={`subscribe-message subscribe-message--${status}`}>{message}</p>}
                </div>

                <div className="footer__social">
                    <h3 className="footer__title">Подписывайтесь на нас</h3>
                    <div className="social-icons">
                        {/* Здесь должны быть иконки соцсетей, например, как ссылки */}
                        <a href="#" className="social-icon social-icon--youtube"></a>
                        <a href="#" className="social-icon social-icon--linkedin"></a>
                        <a href="#" className="social-icon social-icon--google"></a>
                        <a href="#" className="social-icon social-icon--facebook"></a>
                        <a href="#" className="social-icon social-icon--twitter"></a>
                    </div>
                </div>
            </div>
            <div className="footer__bottom">
                <p>Лого</p>
                <a href="#" className="scroll-up-btn"></a>
                <p>2024 &copy; Все права защищены</p>
            </div>
        </footer>
    );
}