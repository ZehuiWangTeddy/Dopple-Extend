import React from "react";
import "./FirstPage.css";
import DoppleHeader from "../components/DoppleHeader";
import CameraFeeds from "../components/cams/CameraFeeds";

const FirstPage = () => {


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
        <div id="cameraFeeds"> 
           <CameraFeeds />
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