// src/pages/MainPage.jsx

import React from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import '../components/SearchForm/SearchForm.css';

export default function MainPage() {
  return (
    <div style={{ 
      padding: '200px 20px', // Просто большой отступ сверху, чтобы форма была по центру
      backgroundColor: '#e0e0e0' // Серый фон, чтобы видеть границы
    }}>
      <h1 style={{ textAlign: 'center' }}>Тестовая страница</h1>
      <p style={{ textAlign: 'center' }}>Здесь только форма поиска</p>
      
      {/* Рендерим ТОЛЬКО форму */}
      <SearchForm />

    </div>
  );
}