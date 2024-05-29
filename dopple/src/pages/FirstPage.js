import React from "react";
import { useNavigate } from "react-router-dom";
import "./FirstPage.css";
import DoppleHeader from "../components/DoppleHeader";
import CameraFeeds from "../components/cams/CameraFeeds";

const FirstPage = () => {
  const navigate = useNavigate();

  const handleOpenDoor = () => {
      console.log("Door opened");
  };

  const handleNextPage = () => {
      navigate("/stats");
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
            {Array.from({ length: 2 }).map((_, index) => ( // Update to iterate only twice
                <button className="open-door-button" key={index} onClick={handleOpenDoor}>
                    Open Door
                </button>
            ))}
            <button className="next-page-button" onClick={handleNextPage}>
                Next Page
            </button>
        </div>
    </div>
  );
};

export default FirstPage;
