import React from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
// Импортируйте статические компоненты About, HowItWorks, Reviews из папки components
// Их код - это просто перенос верстки из HTML

export default function MainPage() {
  return (
    <>
      <section className="main-banner">
        <div className="main-banner__content">
            <h1>Вся жизнь - <strong>путешествие!</strong></h1>
            <SearchForm />
        </div>
      </section>
      
      {/* <section id="about"><About /></section> */}
      {/* <section id="how-it-works"><HowItWorks /></section> */}
      {/* <section id="reviews"><Reviews /></section> */}
    </>
  );
}