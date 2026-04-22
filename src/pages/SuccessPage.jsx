import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';

// Импортируем все экшены для сброса состояния
import { resetOrderState } from '../store/slices/orderSlice';
import { resetPassengers } from '../store/slices/passengersSlice';
import { resetSeats } from '../store/slices/seatsSlice';
import { resetRoutes } from '../store/slices/routesSlice';
import { resetSearch } from '../store/slices/searchSlice';

import './SuccessPage.css'; // Создадим файл стилей

export default function SuccessPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Получаем статус заказа и данные о плательщике и итоговой цене
    const { status: orderStatus } = useSelector(state => state.order);
    const { user } = useSelector(state => state.passengers);
    const { totalPrice } = useSelector(state => state.seats);

    // Защита маршрута. Если заказ не был успешно завершен, перенаправляем на главную.
    useEffect(() => {
        if (orderStatus !== 'success') {
            navigate('/');
        }
    }, [orderStatus, navigate]);

    // Обработчик для кнопки возврата на главную.
    // Здесь мы сбрасываем состояние всех связанных с заказом срезов.
    const handleReturnToMain = () => {
        dispatch(resetOrderState());
        dispatch(resetPassengers());
        dispatch(resetSeats());
        dispatch(resetRoutes());
        dispatch(resetSearch());
    };

    return (
        <div className="success-page">
            <div className="success-card">
                <div className="success-card__header">
                    <h2>{user.firstName || 'Уважаемый клиент'},<br/>Ваш заказ успешно оформлен!</h2>
                </div>
                <div className="success-card__body">
                    <p className="order-number">№Заказа 285АА</p>
                    <div className="order-summary">
                        <span>сумма</span>
                        <span className="price">
                            {formatPrice(totalPrice)} <span className="currency">₽</span>
                        </span>
                    </div>
                    <div className="instructions">
                        <div className="instruction-item">
                            {/* Иконка email */}
                            <p>билеты будут отправлены на ваш e-mail</p>
                            <strong>{user.email}</strong>
                        </div>
                        <div className="instruction-item">
                            {/* Иконка принтера */}
                            <p>распечатайте и сохраняйте билеты до даты поездки</p>
                        </div>
                        <div className="instruction-item">
                            {/* Иконка информации */}
                            <p>предъявите распечатанные билеты при посадке</p>
                        </div>
                    </div>
                </div>
                <div className="success-card__footer">
                    <Link to="/" onClick={handleReturnToMain} className="button--back-to-main">
                        Вернуться на главную
                    </Link>
                </div>
            </div>
        </div>
    );
}