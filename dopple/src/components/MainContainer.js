// src/components/MainContainer.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FirstPage from '../pages/FirstPage';
import SecondPage from '../pages/SecondPage';
import PageSwitcher from './PageSwitcher';

const MainContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    navigate(page === 1 ? '/' : '/stats');
  };

  return (
    <div>
      <div style={{ display: location.pathname === '/' ? 'block' : 'none' }}>
        <FirstPage handleNavigate={handleNavigate} />
      </div>
      <div style={{ display: location.pathname === '/stats' ? 'block' : 'none' }}>
        <SecondPage handleNavigate={handleNavigate} />
      </div>
      <PageSwitcher />
    </div>
  );
};

export default MainContainer;
