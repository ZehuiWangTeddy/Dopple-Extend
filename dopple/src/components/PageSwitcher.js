// src/components/PageSwitcher.js
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PageSwitcher = () => {
  const navigate = useNavigate();
  const doorbellSoundRef = useRef(null); // Ref for doorbell sound
  const [focusTimeout, setFocusTimeout] = useState(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      navigate((prev) => (prev === '/' ? '/stats' : '/'));
    }, 15000); // 15000 milliseconds = 15 seconds

    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    eventSourceRef.current = new EventSource('http://localhost:3000/api/subscribe');

    const handleDoorbellEvent = (door, state) => {
      const eventMsg = `Doorbell ${door} event received with state: ${state}`;
      console.log(eventMsg);

      if (state === 'ON') {

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
