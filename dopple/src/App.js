// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainContainer from './components/MainContainer';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainContainer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
