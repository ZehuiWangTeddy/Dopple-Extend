// src/components/PageSwitcher.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FirstPage from '../pages/FirstPage';
import SecondPage from '../pages/SecondPage';
import './PageSwitcher.css';

const PageSwitcher = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowOverlay(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => {
          const nextPage = prevPage === 1 ? 2 : 1;
          navigate(nextPage === 1 ? '/' : '/stats');
          return nextPage;
        });
      }, 500); // Duration to show overlay before page switch

      setTimeout(() => {
        setShowOverlay(false);
      }, 1500); // Duration to hide overlay after page switch
    }, 60000); // 60000 milliseconds = 60 seconds

    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleNavigate = useCallback((page) => {
    console.log(`Navigating to page ${page}`);
    setShowOverlay(true);
    setTimeout(() => {
      setCurrentPage(page);
      navigate(page === 1 ? '/' : '/stats');
      setShowOverlay(false);
    }, 1000); // Duration for manual navigation
  }, [navigate]);

  const handleDoorbellEvent = useCallback(() => {
    console.log('Doorbell event detected. Switching to page 1.');
    handleNavigate(1); // Switch to the first page
  }, [handleNavigate]);

  return (
    <div className="transition-container">
      <div className={`transition-overlay ${showOverlay ? 'visible' : ''}`}></div>
      <TransitionGroup component={null}>
        <CSSTransition
          key={currentPage}
          classNames="slide"
          timeout={2000}  // Adjust the duration to match the CSS
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            {currentPage === 1 ? (
              <FirstPage handleNavigate={handleNavigate} handleDoorbellEvent={handleDoorbellEvent} />
            ) : (
              <SecondPage handleNavigate={handleNavigate} handleDoorbellEvent={handleDoorbellEvent} />
            )}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default PageSwitcher;
