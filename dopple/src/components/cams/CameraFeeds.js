// src/components/cams/CameraFeeds.js
import React, { useState, useEffect, useRef } from 'react';
import CameraPlayer from './CameraPlayer';
import './CameraFeeds.css';

const cameraUrls = [
  process.env.REACT_APP_CAMERA_FRONT,
  process.env.REACT_APP_CAMERA_BACK,
  process.env.REACT_APP_CAMERA_PARKING,
  process.env.REACT_APP_CAMERA_GLASS,
  process.env.REACT_APP_CAMERA_HAL,
];

const CameraFeeds = () => {
  const activeCameras = cameraUrls.slice(0, 6);
  const [focusedCamera, setFocusedCamera] = useState(null);
  const [focusTimeout, setFocusTimeout] = useState(null);
  const [doorbellMessage, setDoorbellMessage] = useState('');
  const doorbellSoundRef = useRef(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const triggeredCamera = localStorage.getItem('triggeredCamera');
    const doorbellState = localStorage.getItem('doorbellState');

    if (doorbellState === 'ON' && triggeredCamera) {
      setFocusedCamera(triggeredCamera);

      const timeout = setTimeout(() => {
        setFocusedCamera(null);
        localStorage.removeItem('triggeredCamera');
        localStorage.removeItem('doorbellState');
      }, 40000);

      setFocusTimeout(timeout);
    }

    doorbellSoundRef.current = new Audio('https://upload.wikimedia.org/wikipedia/commons/3/34/Sound_Effect_-_Door_Bell.ogg');

    eventSourceRef.current = new EventSource('http://localhost:3000/api/subscribe');

    const handleDoorbellEvent = (door, state) => {
      const eventMsg = `Doorbell ${door} event received with state: ${state}`;
      console.log(eventMsg);

      if (state === 'ON') {
        setDoorbellMessage(`Doorbell ${door} ON`);
        if (doorbellSoundRef.current) {
          doorbellSoundRef.current.play().catch(error => console.error('Error playing sound:', error));
        }
        if (focusTimeout) {
          clearTimeout(focusTimeout);
        }

        const cameraUrl =
          door === 'deurbel_voordeur'
            ? process.env.REACT_APP_CAMERA_FRONT
            : process.env.REACT_APP_CAMERA_BACK;
        setFocusedCamera(cameraUrl);

        const timeout = setTimeout(() => {
          setFocusedCamera(null);
          setFocusTimeout(null);
          setDoorbellMessage('');
        }, 40000); // Keep the camera in focus for 40 seconds

        setFocusTimeout(timeout);
      } else if (state === 'OFF') {
        if (focusTimeout) {
          clearTimeout(focusTimeout);
          setFocusedCamera(null);
          setFocusTimeout(null);
        }
        setDoorbellMessage('');
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
  }, [focusTimeout]);

  return (
    <div className="camera-feeds-container">
      <div className="camera-feeds-wrapper">
        {activeCameras.map((url, index) => (
          <CameraPlayer
            key={index}
            url={url}
            isFocused={url === focusedCamera}
          />
        ))}
      </div>
      {doorbellMessage && (
        <div className="doorbell-message">
          {doorbellMessage}
        </div>
      )}
    </div>
  );
};

export default CameraFeeds;
