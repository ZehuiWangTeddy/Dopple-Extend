// src/components/PageSwitcher.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FirstPage from '../pages/FirstPage';
import SecondPage from '../pages/SecondPage';

const PageSwitcher = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage === 1 ? 2 : 1;
        navigate(nextPage === 1 ? '/' : '/stats');
        return nextPage;
      });
    }, 15000); // 15000 milliseconds = 15 seconds

    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    navigate(page === 1 ? '/' : '/stats');
  };

  return (
    <div>
      {currentPage === 1 ? (
        <FirstPage handleNavigate={handleNavigate} />
      ) : (
        <SecondPage handleNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default PageSwitcher;
