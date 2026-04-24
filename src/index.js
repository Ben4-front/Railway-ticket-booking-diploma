// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // <-- 1. Импортируйте Provider
import { store } from './store/store'; // <-- 2. Импортируйте ваш store
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 3. Оберните App в Provider и передайте ему store
  <Provider store={store}> 
    <App />
  </Provider>
);