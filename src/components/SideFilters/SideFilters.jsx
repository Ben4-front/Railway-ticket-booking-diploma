import React from 'react';
import './SideFilters.css'; // Создайте этот файл стилей

// Вспомогательный компонент для переключателя
const Switch = ({ label, name, checked, onChange }) => (
    <div className="filter-switch">
        <span>{label}</span>
        <label className="switch">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={(e) => onChange(name, e.target.checked)}
            />
            <span className="slider round"></span>
        </label>
    </div>
);

// Вспомогательный компонент для ползунка цен
// Для реального проекта лучше использовать библиотеку типа 'react-input-range'
const PriceSlider = ({ from, to, onChange }) => (
    <div className="filter-price">
        <label>Стоимость</label>
        <div className="price-range">
            от <input type="number" value={from} onChange={(e) => onChange('price_from', e.target.value)} />
            до <input type="number" value={to} onChange={(e) => onChange('price_to', e.target.value)} />
        </div>
    </div>
);

export default function SideFilters({ filters, onFilterChange }) {
    return (
        <div className="side-filters">
            <div className="filter-group">
                <Switch label="Купе" name="have_second_class" checked={filters.have_second_class} onChange={onFilterChange} />
                <Switch label="Плацкарт" name="have_third_class" checked={filters.have_third_class} onChange={onFilterChange} />
                <Switch label="Сидячий" name="have_fourth_class" checked={filters.have_fourth_class} onChange={onFilterChange} />
                <Switch label="Люкс" name="have_first_class" checked={filters.have_first_class} onChange={onFilterChange} />
                <Switch label="Wi-Fi" name="have_wifi" checked={filters.have_wifi} onChange={onFilterChange} />
                <Switch label="Экспресс" name="have_express" checked={filters.have_express} onChange={onFilterChange} />
            </div>
            
            <div className="filter-group">
                <PriceSlider
                    from={filters.price_from}
                    to={filters.price_to}
                    onChange={onFilterChange}
                />
            </div>
            {/* TODO: Добавить ползунки для времени отправления/прибытия */}
        </div>
    );
}