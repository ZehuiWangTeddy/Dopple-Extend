// src/components/ToastNotification.js
import React, { useState, useEffect } from 'react';
import './ToastNotification.css';
import eventEmitter from './utils/eventEmitter';

const ToastNotification = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleToast = (message) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000); // Hide the toast after 2 seconds
    };

    eventEmitter.on('toast', handleToast);

    return () => {
      eventEmitter.off('toast', handleToast);
    };
  }, []);

  return (
    showToast && (
      <div className="toast-message">
        {toastMessage}
      </div>
    )
  );
};

export default ToastNotification;
