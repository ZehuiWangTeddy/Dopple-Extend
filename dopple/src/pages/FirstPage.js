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
    <div>
        <DoppleHeader />
    <div className="dashboard-container">
      
      <div className="main-content">
        <div className="content">
          <div id="cameraFeeds">
            <CameraFeeds />
          </div>
        </div>
        <div className="buttons">
          {Array.from({ length: 2 }).map((_, index) => (
            <button className="open-door-button" key={index} onClick={handleOpenDoor}>
              Open Door
            </button>
          ))}
          <button className="next-page-button" onClick={handleNextPage}>
            Next Page
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FirstPage;
