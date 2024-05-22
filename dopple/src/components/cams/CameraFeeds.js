// CameraFeeds.js
import React from 'react';
import CameraPlayer from './CameraPlayer';
import './CameraFeeds.css';

const cameraUrls = [
  process.env.REACT_APP_CAMERA_FRONT,
  process.env.REACT_APP_CAMERA_TEST,
  process.env.REACT_APP_CAMERA_TEST,
  process.env.REACT_APP_CAMERA_TEST,
  process.env.REACT_APP_CAMERA_TEST,
  
];

const CameraFeeds = () => {
  const activeCameras = cameraUrls.slice(0, 6);

  return (
    <div className="camera-feeds-container">
      
      <div className="camera-feeds-wrapper">
        {activeCameras.map((url, index) => (
          <CameraPlayer key={index} url={url} />
        ))}
      </div>
    </div>
  );
};

export default CameraFeeds;
