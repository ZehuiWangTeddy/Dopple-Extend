// src/components/PageSwitcher.js
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PageSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [focusTimeout, setFocusTimeout] = useState(null);
  const [userActionTimeout, setUserActionTimeout] = useState(null);
  const eventSourceRef = useRef(null);
  const autoSwitchIntervalRef = useRef(null);

  useEffect(() => {
    const startAutoSwitchTimer = () => {
      autoSwitchIntervalRef.current = setInterval(() => {
        if (!focusTimeout && !userActionTimeout) { // check if any camera isnt on focus or user performed any action
          navigate(location.pathname === '/' ? '/stats' : '/');
        }
      }, 15000); // 15000 milliseconds = 15 seconds
    };

    startAutoSwitchTimer();

    return () => {
      if (autoSwitchIntervalRef.current) {
        clearInterval(autoSwitchIntervalRef.current);
      }
    };
  }, [navigate, location.pathname, focusTimeout, userActionTimeout]);

  useEffect(() => {
    const resetUserActionTimeout = () => {
      if (userActionTimeout) {
        clearTimeout(userActionTimeout);
      }
      setUserActionTimeout(setTimeout(() => setUserActionTimeout(null), 30000)); // 30000 milliseconds = 30 seconds
    };

    const handleUserAction = () => {
      resetUserActionTimeout();
    };

    window.addEventListener('click', handleUserAction);
    window.addEventListener('keydown', handleUserAction);
    window.addEventListener('mousemove', handleUserAction);

    return () => {
      window.removeEventListener('click', handleUserAction);
      window.removeEventListener('keydown', handleUserAction);
      window.removeEventListener('mousemove', handleUserAction);
      if (userActionTimeout) {
        clearTimeout(userActionTimeout);
      }
    };
  }, [userActionTimeout]);

  useEffect(() => {
    eventSourceRef.current = new EventSource('http://localhost:3000/api/subscribe');

    const handleDoorbellEvent = (door, state) => {
      const eventMsg = `Doorbell ${door} event received with state: ${state}`;
      console.log(eventMsg);

      if (state === 'ON') {
        if (focusTimeout) {
          clearTimeout(focusTimeout);
        }

        navigate('/');

        const timeout = setTimeout(() => {
          setFocusTimeout(null);
        }, 40000); // Keep the camera in focus for 40 seconds

        setFocusTimeout(timeout);
      } else if (state === 'OFF') {
        if (focusTimeout) {
          clearTimeout(focusTimeout);
          setFocusTimeout(null);
        }
      }
    };

    eventSourceRef.current.onopen = () => {
      console.log('>>> Connection opened!');
    };

    eventSourceRef.current.onerror = (e) => {
      console.error('>>> EventSource failed:', e);
    };

    eventSourceRef.current.addEventListener('mqtt_message', (event) => {
      console.log('>>> Event received:', event);

      const eventData = JSON.parse(event.data);
      const { topic, data } = eventData;
      const message = JSON.parse(data);
      const { state } = message;

      if (topic === 'dopple_access/ringers/deurbel_voordeur/doorbell') {
        handleDoorbellEvent('deurbel_voordeur', state);
      } else if (topic === 'dopple_access/ringers/deurbel_achterdeur/doorbell') {
        handleDoorbellEvent('deurbel_achterdeur', state);
      }
    });

    return () => {
      eventSourceRef.current.close();
      if (focusTimeout) {
        clearTimeout(focusTimeout);
      }
    };
  }, [navigate, focusTimeout]);

  return null;
};

export default PageSwitcher;
