import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitOrder, resetOrderState } from '../store/slices/orderSlice';
import ProgressBar from '../components/Common/ProgressBar';
import { formatPrice, formatTime, formatDate } from '../utils/formatters';
import './ConfirmationPage.css'; // Создадим файл стилей

// Вспомогательный компонент для отображения информации о маршруте
const RouteDetails = ({ routeData, seats }) => {
    if (!routeData) return null;
    return (
        <div className="confirmation-block">
            <h4 className="confirmation-block__title">Поезд</h4>
            <div className="confirmation-route">
                <div className="train-info">
                    {/* Иконка поезда */}
                    <span className="train-name">{routeData.train.name}</span>
                    <span>{routeData.from.city.name} &rarr; {routeData.to.city.name}</span>
                </div>
                <div className="direction-details">
                    <div className="direction-point">
                        <span className="time">{formatTime(routeData.from.datetime)}</span>
                        <span className="date">{formatDate(routeData.from.datetime)}</span>
                        <span className="city">{routeData.from.city.name}</span>
                        <span className="station">{routeData.from.railway_station_name} вокзал</span>
                    </div>
                    <div className="direction-arrow">
                        {/* Иконка стрелки */}
                    </div>
                    <div className="direction-point">
                        <span className="time">{formatTime(routeData.to.datetime)}</span>
                        <span className="date">{formatDate(routeData.to.datetime)}</span>
                        <span className="city">{routeData.to.city.name}</span>
                        <span className="station">{routeData.to.railway_station_name} вокзал</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Вспомогательный компонент для отображения информации о пассажирах
const PassengersDetails = ({ passengers }) => (
    <div className="confirmation-block">
        <h4 className="confirmation-block__title">Пассажиры</h4>
        <div className="passengers-list">
            {passengers.map((p, index) => (
                <div key={index} className="passenger-item">
                    <div className="passenger-info">
                        {/* Иконка пассажира */}
                        <span>{p.isAdult ? 'Взрослый' : 'Детский'}</span>
                        <p>{`${p.lastName} ${p.firstName} ${p.patronymic}`}</p>
                    </div>
                    <div className="passenger-docs">
                        <p>Пол {p.gender === 'male' ? 'мужской' : 'женский'}</p>
                        <p>Дата рождения {formatDate(p.birthday)}</p>
                        <p>{p.documentType === 'passport' ? 'Паспорт РФ' : 'Свидетельство о рождении'} {p.documentSeries} {p.documentNumber}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function ConfirmationPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Получаем все необходимые данные из Redux
    const { departureRoute, arrivalRoute, totalPrice } = useSelector(state => state.seats);
    const { passengers } = useSelector(state => state.passengers);
    const { status: orderStatus, error: orderError } = useSelector(state => state.order);

    // Защита от прямого доступа
    useEffect(() => {
        if (!departureRoute || passengers.length === 0) {
            navigate('/');
        }
    }, [departureRoute, passengers, navigate]);

    // Обработка статуса отправки заказа
    useEffect(() => {
        if (orderStatus === 'success') {
            navigate('/success');
        }
        if (orderStatus === 'error') {
            // Можно показать модальное окно с ошибкой
            alert(`Произошла ошибка при создании заказа: ${orderError}`);
            // Сбрасываем состояние заказа, чтобы можно было попробовать еще раз
            dispatch(resetOrderState());
        }
    }, [orderStatus, orderError, navigate, dispatch]);

    const handleConfirm = () => {
        dispatch(submitOrder());
    };

    return (
        <div className="confirmation-page">
            <ProgressBar step={4} />

            <div className="container confirmation-content">
                <h3 className="page-title">Подтверждение заказа</h3>
                
                <div className="details-wrapper">
                    <div className="trip-details">
                        <RouteDetails routeData={departureRoute} />
                        {arrivalRoute && <RouteDetails routeData={arrivalRoute} />}
                        <PassengersDetails passengers={passengers} />
                    </div>

                    <div className="summary">
                        <div className="summary-block">
                            <h4 className="summary-block__title">Итог</h4>
                            <div className="summary-price">
                                <span>Сумма</span>
                                <span className="price-value">
                                    {formatPrice(totalPrice)} <span className="currency">₽</span>
                                </span>
                            </div>
                            <button 
                                className="button--confirm"
                                onClick={handleConfirm}
                                disabled={orderStatus === 'pending'}
                            >
                                {orderStatus === 'pending' ? 'Обработка...' : 'Подтвердить'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}