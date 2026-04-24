import React from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import './MainPage.css'; // <-- Импортируем стили

export default function MainPage() {
  return (
    <>
      {/* Главный баннер */}
      <section className="main-page-banner">
        <div className="container">
          <h1 className="main-page-banner__title">
            Вся жизнь - <br/> <strong>путешествие!</strong>
          </h1>
          <SearchForm />
        </div>
      </section>

      {/* Секция "О нас" */}
      <section id="about" className="main-page-section">
        <div className="container">
          <h2 className="main-page-section__title">О нас</h2>
          <p style={{textAlign: 'center'}}>Здесь будет контент о компании...</p>
        </div>
      </section>

      {/* Другие секции по аналогии */}
      <section id="how-it-works" className="main-page-section">
        <div className="container">
          <h2 className="main-page-section__title">Как это работает</h2>
          <p style={{textAlign: 'center'}}>Здесь будет контент о том, как работает сервис...</p>
        </div>
      </section>
    </>
  );
}