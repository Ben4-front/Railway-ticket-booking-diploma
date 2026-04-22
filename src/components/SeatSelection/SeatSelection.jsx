import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoachTypeName, formatPrice } from '../../utils/formatters';
import { toggleSeat } from '../../store/slices/seatsSlice';
import classNames from 'classnames';

// Компонент одного места
const Seat = ({ number, type, available, selected, onClick }) => {
    const seatClasses = classNames('seat', `seat--${type}`, {
        'seat--available': available,
        'seat--occupied': !available,
        'seat--selected': selected,
    });

    return (
        <div className={seatClasses} onClick={available ? onClick : null}>
            {number}
        </div>
    );
};

// Компонент схемы вагона
const CoachLayout = ({ coach, direction }) => {
    const dispatch = useDispatch();
    const selectedSeats = useSelector(state => state.seats.selectedSeats[direction]);

    const handleSeatClick = (seat_number) => {
        const seatInfo = {
            coach_id: coach.coach._id,
            seat_number,
            price: coach.coach.price, // Базовая цена места
            // Можно добавить и цены услуг, если нужно
        };
        dispatch(toggleSeat({ direction, seatInfo }));
    };

    const isSeatSelected = (seatNumber) => {
        return selectedSeats.some(
            s => s.coach_id === coach.coach._id && s.seat_number === seatNumber
        );
    };
    
    // Рендерим схему в зависимости от типа вагона
    // Это упрощенный пример, реальная логика расположения будет сложнее
    const renderSeats = () => {
        return coach.seats.map(seat => (
            <Seat
                key={seat.index}
                number={seat.index}
                type="default" // Тип места (верхнее/нижнее) нужно определять по номеру
                available={seat.available}
                selected={isSeatSelected(seat.index)}
                onClick={() => handleSeatClick(seat.index)}
            />
        ));
    };

    return (
        <div className="coach-layout">
            <div className="coach-layout__info">
                <span>Вагон №{coach.coach.name}</span>
                <span>Тип: {getCoachTypeName(coach.coach.class_type)}</span>
            </div>
            <div className="coach-layout__scheme">
                {renderSeats()}
            </div>
        </div>
    );
};


// Основной компонент выбора мест для одного направления
export default function SeatSelection({ direction }) { // direction: 'departure' | 'arrival'
    const dispatch = useDispatch();
    const route = useSelector(state => state.seats[`${direction}Route`]);
    const seatsData = useSelector(state => state.seats[`${direction}SeatsData`]);
    const { status, error } = useSelector(state => state.seats);

    const [selectedCoachType, setSelectedCoachType] = useState('second'); // 'first', 'second', etc.

    // Фильтруем вагоны по выбранному типу
    const filteredCoaches = seatsData.filter(
        c => c.coach.class_type === selectedCoachType
    );

    return (
        <div className="seat-selection">
            <h3>Выбор мест ({direction === 'departure' ? 'Туда' : 'Обратно'})</h3>
            <div className="coach-type-selector">
                {/* TODO: Сделать кнопки для выбора типа вагона */}
                <button onClick={() => setSelectedCoachType('second')}>Купе</button>
                <button onClick={() => setSelectedCoachType('third')}>Плацкарт</button>
                {/* ... и т.д. */}
            </div>

            {status === 'loading' && <div>Загрузка информации о местах...</div>}
            {status === 'failed' && <div className="error-message">Ошибка: {error}</div>}
            {status === 'succeeded' && (
                <div className="coaches-list">
                    {filteredCoaches.map(coach => (
                        <CoachLayout key={coach.coach._id} coach={coach} direction={direction} />
                    ))}
                </div>
            )}
        </div>
    );
}