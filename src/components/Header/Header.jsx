import React from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Header.css';
import logo from '../../assets/images/logo.svg'; // Убедитесь, что у вас есть логотип по этому пути

export default function Header() {
    // Функция для плавной прокрутки, которую использует HashLink
    const smoothScroll = (el) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__logo">
                    <NavLink to="/">
                        <img src={logo} alt="Логотип Railway Tickets" />
                        <span>Лого</span>
                    </NavLink>
                </div>
                <nav className="header__nav">
                    <ul>
                        <li>
                            <HashLink to="/#about" smooth scroll={smoothScroll}>
                                О нас
                            </HashLink>
                        </li>
                        <li>
                            <HashLink to="/#how-it-works" smooth scroll={smoothScroll}>
                                Как это работает
                            </HashLink>
                        </li>
                        <li>
                            <HashLink to="/#reviews" smooth scroll={smoothScroll}>
                                Отзывы
                            </HashLink>
                        </li>
                        <li>
                            <HashLink to="/#contacts" smooth scroll={smoothScroll}>
                                Контакты
                            </HashLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}