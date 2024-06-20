// src/components/cams/CameraFeeds.js
import React, { useState, useEffect, useRef } from 'react';
import CameraPlayer from './CameraPlayer';
import OpenDoor from '../OpenDoor';
import Toast from '../Toast'; // Import the Toast component
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
  const [toastMessage, setToastMessage] = useState(''); // State for toast messages
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

  const handleOpenDoorClick = () => {
    if (focusTimeout) {
      clearTimeout(focusTimeout);
    }
    setFocusedCamera(null);
    setFocusTimeout(null);
  };

  return (
    <div className="camera-feeds-container">
      <div className="camera-feeds-wrapper">
        {activeCameras.map((url, index) => (
          <div key={index} className="camera-player-container">
            <CameraPlayer
              url={url}
              isFocused={url === focusedCamera}
            />
            {url === focusedCamera && (
              <div className="open-door-button-container">
                {url === process.env.REACT_APP_CAMERA_FRONT ? (
                  <OpenDoor doorIndex={1} doorLabel="Open Front Door" onClick={handleOpenDoorClick} />
                ) : url === process.env.REACT_APP_CAMERA_BACK ? (
                  <OpenDoor doorIndex={2} doorLabel="Open Back Door" onClick={handleOpenDoorClick} />
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
      {doorbellMessage && (
        <div className="doorbell-message">
          {doorbellMessage}
        </div>
      )}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default CameraFeeds;
