import React from 'react';
import classNames from 'classnames';
import './ProgressBar.css'; // Создайте этот файл стилей

export default function ProgressBar({ step = 1 }) {
    const steps = [
        { id: 1, title: 'Билеты' },
        { id: 2, title: 'Пассажиры' },
        { id: 3, title: 'Оплата' },
        { id: 4, title: 'Проверка' },
    ];

    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                {steps.map((item, index) => (
                    <div
                        key={item.id}
                        className={classNames('progress-bar__step', {
                            'progress-bar__step--active': item.id === step,
                            'progress-bar__step--completed': item.id < step,
                        })}
                    >
                        <div className="progress-bar__bubble">
                            <span>{item.id}</span>
                        </div>
                        <span className="progress-bar__title">{item.title}</span>
                    </div>
                ))}
                <div className="progress-bar__line-bg">
                    <div
                        className="progress-bar__line-fg"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}