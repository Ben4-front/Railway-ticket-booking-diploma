import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../store/slices/passengersSlice';
import ProgressBar from '../components/Common/ProgressBar';
import './PaymentPage.css'; // Создайте файл стилей

export default function PaymentPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Получаем данные о пользователе и выбранных местах из Redux
    const { user } = useSelector(state => state.passengers);
    const { departure: departureSeats } = useSelector(state => state.seats.selectedSeats);

    // Защита от прямого доступа к странице без выбранных билетов
    useEffect(() => {
        if (departureSeats.length === 0) {
            navigate('/');
        }
    }, [departureSeats, navigate]);
    
    // Инициализируем react-hook-form с данными из Redux
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            ...user
        },
        mode: 'onChange' // Валидация будет срабатывать при изменении полей
    });

    // Следим за изменением способа оплаты, чтобы показать/скрыть поля для карты
    const paymentMethod = watch('paymentMethod');

    // Обработчик отправки формы
    const onSubmit = (data) => {
        // Сохраняем данные плательщика в Redux
        dispatch(setUserData(data));
        // Переходим на следующую страницу - подтверждение заказа
        navigate('/confirmation');
    };

    return (
        <div className="payment-page">
            <ProgressBar step={3} />
            
            <div className="container">
                <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
                    <section className="form-section">
                        <h3 className="form-section__title">Персональные данные</h3>
                        <div className="form-section__content form-section__content--grid">
                            <div className="form-field">
                                <label>Фамилия</label>
                                <input 
                                    {...register('lastName', { required: 'Это поле обязательно' })} 
                                />
                                {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
                            </div>
                            <div className="form-field">
                                <label>Имя</label>
                                <input 
                                    {...register('firstName', { required: 'Это поле обязательно' })}
                                />
                                {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
                            </div>
                            <div className="form-field">
                                <label>Отчество</label>
                                <input 
                                    {...register('patronymic')}
                                />
                            </div>
                            <div className="form-field">
                                <label>Контактный телефон</label>
                                <input 
                                    {...register('phone', {
                                        required: 'Это поле обязательно',
                                        pattern: {
                                            value: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
                                            message: 'Введите телефон в формате +7 (999) 999-99-99'
                                        }
                                    })}
                                    placeholder="+7 (___) ___-__-__"
                                />
                                {errors.phone && <p className="error-text">{errors.phone.message}</p>}
                            </div>
                            <div className="form-field">
                                <label>E-mail</label>
                                <input 
                                    {...register('email', {
                                        required: 'Это поле обязательно',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Неверный формат e-mail'
                                        }
                                    })}
                                    placeholder="inbox@gmail.ru"
                                />
                                {errors.email && <p className="error-text">{errors.email.message}</p>}
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <h3 className="form-section__title">Способ оплаты</h3>
                        <div className="form-section__content">
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <div className="payment-options">
                                        <label className="payment-option">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="online"
                                                checked={field.value === 'online'}
                                            />
                                            Онлайн
                                        </label>
                                        <label className="payment-option">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="cash"
                                                checked={field.value === 'cash'}
                                            />
                                            Наличными
                                        </label>
                                    </div>
                                )}
                            />
                            {paymentMethod === 'online' && (
                                <div className="online-payment-fields">
                                    <p>Банковской картой</p>
                                    {/* Здесь могут быть поля для номера карты, срока действия, CVC */}
                                    {/* В рамках диплома их можно сделать неактивными или просто для вида */}
                                    <div className="form-field form-field--disabled">
                                        <label>Номер карты</label>
                                        <input disabled placeholder="____ ____ ____ ____" />
                                    </div>
                                    <div className="form-field form-field--disabled">
                                        <label>Срок действия</label>
                                        <input disabled placeholder="ММ/ГГ" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" className="button--next">
                            Купить билеты
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}