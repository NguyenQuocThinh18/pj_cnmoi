/*
 * main.jsx
 * Bootstrap React app và import CSS/JS cần thiết.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- DÒNG NÀY ĐỂ MENU CÓ THỂ CLICK VÀ HIỆN RA
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // File CSS ở Bước 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);