import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRoutesForSelection } from '../../store/slices/seatsSlice';
import { formatTime, formatDuration, formatPrice } from '../../utils/formatters';

// Маленький компонент для отображения одного направления
const DirectionInfo = ({ direction }) => {
    if (!direction) return null;
    return (
        <div className="route-item__direction">
            <div className="route-item__city-time">
                <span className="time">{formatTime(direction.from.datetime)}</span>
                <span className="city">{direction.from.city.name}</span>
                <span className="station">{direction.from.railway_station_name}</span>
            </div>
            <div className="route-item__duration">
                <span>{formatDuration(direction.duration)}</span>
                {/* Иконка стрелки */}
            </div>
            <div className="route-item__city-time">
                <span className="time">{formatTime(direction.to.datetime)}</span>
                <span className="city">{direction.to.city.name}</span>
                <span className="station">{direction.to.railway_station_name}</span>
            </div>
        </div>
    );
};

export default function RouteItem({ route }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSelectSeats = () => {
        // Сохраняем данные о маршруте(ах) в срез seatsSlice
        dispatch(setRoutesForSelection({ 
            departure: route.departure, 
            arrival: route.arrival 
        }));
        // Переходим на страницу выбора мест (которую мы создадим)
        // В ТЗ это та же страница, просто меняется контент
        // Но для SPA лучше иметь отдельный роут /seats или state в URL
        // Пока сделаем переход на страницу пассажиров для простоты
        navigate('/passengers');
    };

    const { departure, arrival, available_seats_info } = route;

    return (
        <div className="route-item">
            <div className="route-item__main">
                <div className="route-item__train-info">
                    {/* Иконка поезда */}
                    <span className="train-name">{departure.train.name}</span>
                    <span className="train-route">{departure.from.city.name} &rarr; {departure.to.city.name}</span>
                </div>
                <div className="route-item__directions">
                    <DirectionInfo direction={departure} />
                    {arrival && <DirectionInfo direction={arrival} />}
                </div>
            </div>
            <div className="route-item__aside">
                <div className="route-item__price-info">
                    {available_seats_info.second && <span>Купе от {formatPrice(available_seats_info.second.min_price)} ₽</span>}
                    {available_seats_info.third && <span>Плацкарт от {formatPrice(available_seats_info.third.min_price)} ₽</span>}
                </div>
                <button className="route-item__select-btn" onClick={handleSelectSeats}>
                    Выбрать места
                </button>
            </div>
        </div>
    );
}