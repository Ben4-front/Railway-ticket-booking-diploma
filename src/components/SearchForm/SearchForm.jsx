import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCities, setField, setPoint, swapPoints } from '../../store/slices/searchSlice';
import useDebounce from '../../hooks/useDebounce';
import classNames from 'classnames';

const CityInput = ({ direction }) => {
    const dispatch = useDispatch();
    const point = useSelector((state) => state.search[direction]);
    const { cities, status } = useSelector((state) => state.search);

    const [localValue, setLocalValue] = useState(point.name);
    const [isFocused, setIsFocused] = useState(false);
    const debouncedValue = useDebounce(localValue, 300);

    useEffect(() => {
        setLocalValue(point.name);
    }, [point.name]);

    useEffect(() => {
        if (debouncedValue.length > 1 && isFocused) {
            dispatch(getCities(debouncedValue));
        }
    }, [debouncedValue, isFocused, dispatch]);

    const handleSelect = (city) => {
        dispatch(setPoint({ direction, city }));
        setLocalValue(city.name);
        setIsFocused(false);
    };

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
            {isFocused && cities.length > 0 && (
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
        e.preventDefault();
        const params = { from_city_id: from.id, to_city_id: to.id, date_start, date_end };
        const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();
        navigate(`/selection?${query}`);
    };

    const formClasses = classNames('search-form', {
        'search-form--horizontal': variant === 'horizontal'
    });

    return (
        <form className={formClasses} onSubmit={handleSubmit}>
            <div className="form__group form__group--cities">
                <CityInput direction="from" />
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
            <button className="form__submit-btn" type="submit" disabled={!from.id || !to.id}>
                Найти билеты
            </button>
        </form>
    );
}