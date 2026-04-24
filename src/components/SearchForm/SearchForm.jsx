// src/components/SearchForm/SearchForm.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCities, setField, setPoint, swapPoints } from '../../store/slices/searchSlice';
import useDebounce from '../../hooks/useDebounce';
import classNames from 'classnames';
import './SearchForm.css';

// Код CityInput оставляем без изменений
const CityInput = ({ direction }) => {
    const dispatch = useDispatch();
    const point = useSelector((state) => state.search[direction]);
    const { items: cities, status, loadingFor } = useSelector((state) => state.search.cities);
    const [localValue, setLocalValue] = useState(point.name);
    const [isFocused, setIsFocused] = useState(false);
    const debouncedValue = useDebounce(localValue, 300);

    useEffect(() => {
        setLocalValue(point.name);
    }, [point.name]);

    useEffect(() => {
        if (debouncedValue.length > 1 && isFocused) {
            dispatch(getCities({ name: debouncedValue, direction }));
        }
    }, [debouncedValue, isFocused, dispatch, direction]);

    const handleSelect = (city) => {
        dispatch(setPoint({ direction, city }));
        setLocalValue(city.name);
        setIsFocused(false);
    };

    const isLoading = status === 'loading' && loadingFor === direction;

    return (
        <div className="form__field">
            <input
                type="text"
                className="form__input"
                placeholder={direction === 'from' ? 'Откуда' : 'Куда'}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            {isLoading && <div className="loading-spinner"></div>}
            {isFocused && cities.length > 0 && !isLoading && (
                <ul className="city-suggestions">
                    {cities.map((city) => (
                        <li key={city._id} onMouseDown={() => handleSelect(city)}>
                            {city.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default function SearchForm({ variant = 'default' }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { from, to, date_start, date_end } = useSelector((state) => state.search);
    
    const handleSubmit = (e) => {
        console.log('Обработчик handleSubmit сработал!');
        e.preventDefault();

        const params = {
            from_city_id: from.id,
            to_city_id: to.id,
            date_start: date_start,
            date_end: date_end,
        };

        const filteredParams = Object.entries(params).filter(([, value]) => value != null && value !== '');
        const query = new URLSearchParams(filteredParams).toString();
        
        console.log(`Перехожу на /selection?${query}`);
        navigate(`/selection?${query}`);
    };

    const formClasses = classNames('search-form', {
        'search-form--horizontal': variant === 'horizontal'
    });

    // ===============================================
    //           ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ
    // ===============================================
    // Мы оборачиваем всё в тег <form> и вешаем onSubmit на него.
    // Кнопка смены направления находится внутри, но с type="button",
    // что предотвращает отправку формы по клику на нее.
    return (
        <form className={formClasses} onSubmit={handleSubmit}>
            <div className="form__group form__group--cities">
                <CityInput direction="from" />
                
                {/* Эта кнопка НЕ отправляет форму, так как у нее type="button" */}
                <button type="button" className="form__swap-btn" onClick={() => dispatch(swapPoints())} />

                <CityInput direction="to" />
            </div>
            <div className="form__group form__group--dates">
                <input
                    type="date"
                    className="form__input"
                    value={date_start || ''}
                    onChange={(e) => dispatch(setField({ field: 'date_start', value: e.target.value }))}
                />
                <input
                    type="date"
                    className="form__input"
                    value={date_end || ''}
                    onChange={(e) => dispatch(setField({ field: 'date_end', value: e.target.value }))}
                />
            </div>

            {/* Эта кнопка ОТПРАВЛЯЕТ форму, так как у нее type="submit" */}
            <button className="form__submit-btn" type="submit" disabled={!from.id || !to.id}>
                Найти билеты
            </button>
        </form>
    );
}