import React, { useEffect, useRef, useState } from 'react';
import doppleLog from "../../assets/doppleLog.PNG";
import './CameraFeeds.css';

const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
};

const CameraPlayer = ({ url, isFocused }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScript('https://cdn.bootcdn.net/ajax/libs/flv.js/1.5.0/flv.min.js', () => {
      if (window.flvjs && window.flvjs.isSupported()) {
        const videoElement = videoRef.current;
        const flvPlayer = window.flvjs.createPlayer({
          type: 'flv',
          hasAudio: false,
          isLive: true,
          url: url,
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();

        const handleCanPlay = () => {
          setLoading(false);
          videoElement.play().catch((error) => {
            console.error('Error attempting to play video:', error);
          });
        };

        videoElement.addEventListener('canplay', handleCanPlay);

        return () => {
          flvPlayer.destroy();
          videoElement.removeEventListener('canplay', handleCanPlay);
        };
      }
    });
  }, [url]);

  return (
    <div 
      className={`camera-player ${isFocused ? 'focused' : ''}`}
      style={{ 
        transition: 'transform 0.3s, z-index 0.3s',
        zIndex: isFocused ? 10 : 1
      }}
    >
      {loading && (
        <div className="camera-player-loading">
          <img src={doppleLog} alt="Loading" style={{ width: '380px', height: '260px' }}/>
        </div>
      )}
      <video 
        ref={videoRef} 
        controls 
        autoPlay 
        muted 
        className="camera-player-video"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default CameraPlayer;
