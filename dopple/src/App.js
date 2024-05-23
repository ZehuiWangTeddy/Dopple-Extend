import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SecondPage from './pages/SecondPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SecondPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;