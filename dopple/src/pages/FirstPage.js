import React from "react";
import "./FirstPage.css";
import DoppleHeader from "../components/DoppleHeader";

const FirstPage = () => {

  const streams = [
    "http://xxx/xxx/xxx.flv",
    "http://xxx/xxx/xxx.flv", // I added dummy links
    "http://xxx/xxx/xxx.flv", // I added dummy links
    "http://xxx/xxx/xxx.flv", // I added dummy links
    "http://xxx/xxx/xxx.flv", // I added dummy links
    "http://xxx/xxx/xxx.flv", // I added dummy links
  ];

  const handleOpenDoor = () => {
    console.log("Door opened");
  };
  
  return (
    <div className="dashboard-container">
        <DoppleHeader />
        <div className="cameraViewText">
            <h3>Camera View</h3>
        </div>
        <div className="content">
            <div className="cameraFeeds">
                <div className="camera-grid">
                    {streams.map((streamUrl, index) => (
                    <div className="camera" key={index}>
                        <div className="react-player-wrapper">
                            
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="buttons">
            {Array.from({ length: 3 }).map((_, index) => (
            <button className="open-door-button" key={index} onClick={handleOpenDoor}>
                Open Door
            </button>
            ))}
        </div>
    </div>
  );
};

export default FirstPage;