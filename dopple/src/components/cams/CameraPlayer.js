import React, { useEffect, useRef, useState } from 'react';
import doppleLogo from "../../assets/doppleLogo.png";
import './CameraFeeds.css';

const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
};

const CameraPlayer = ({ url }) => {
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
    <div style={{ position: 'relative', width: '300px', height: '280px' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2,
        }}>
          <img src={doppleLogo} alt="Loading" style={{ width: '50px', height: '50px' }} />
        </div>
      )}
      <video 
        ref={videoRef} 
        controls 
        autoPlay 
        muted 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: loading ? 'none' : 'block' 
        }} 
      />
    </div>
  );
};

export default CameraPlayer;
