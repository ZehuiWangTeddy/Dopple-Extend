// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import PageSwitcher from './components/PageSwitcher';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageSwitcher />} />
        <Route path="/stats" element={<PageSwitcher />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
