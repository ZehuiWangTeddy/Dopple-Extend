import React, { useEffect, useState } from 'react';
import CameraPlayer from './CameraPlayer';
import './CameraFeeds.css';

const cameraUrls = [
    process.env.REACT_APP_CAMERA_FRONT,
    process.env.REACT_APP_CAMERA_BACK,
    process.env.REACT_APP_CAMERA_PARKING,
    process.env.REACT_APP_CAMERA_HAL,
    process.env.REACT_APP_CAMERA_TEST,
];

const CameraFeeds = () => {
    const [cameraStyles, setCameraStyles] = useState(cameraUrls.map(() => ({ width: '400px', height: '280px' })));

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/mqtt/subscribe');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.topic === 'dopple_access/ringers/deurbel_voordeur/doorbell') {
                if (data.data === 'ON') {
                    setCameraStyles((prevStyles) => {
                        const newStyles = [...prevStyles];
                        newStyles[0] = { width: '800px', height: '560px' }; // Assuming index 0 is for the front camera
                        return newStyles;
                    });
                    setTimeout(() => {
                        setCameraStyles((prevStyles) => {
                            const newStyles = [...prevStyles];
                            newStyles[0] = { width: '400px', height: '280px' };
                            return newStyles;
                        });
                    }, 30000); // 20 seconds
                }
            } else if (data.topic === 'dopple_access/ringers/deurbel_achterdeur/doorbell') {
                if (data.data === 'ON') {
                    setCameraStyles((prevStyles) => {
                        const newStyles = [...prevStyles];
                        newStyles[1] = { width: '800px', height: '560px' }; // Assuming index 1 is for the back camera
                        return newStyles;
                    });
                    setTimeout(() => {
                        setCameraStyles((prevStyles) => {
                            const newStyles = [...prevStyles];
                            newStyles[1] = { width: '400px', height: '280px' };
                            return newStyles;
                        });
                    }, 30000); // 20 seconds
                }
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="camera-feeds-container">
            <div className="camera-feeds-wrapper">
                {cameraUrls.map((url, index) => (
                    <CameraPlayer key={index} url={url} style={cameraStyles[index]} />
                ))}
            </div>
        </div>
    );
};

export default CameraFeeds;
