import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import ListingsPage from './components/ListingsPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
