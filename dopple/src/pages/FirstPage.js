// src/pages/FirstPage.js
import React from "react";
import "./FirstPage.css";
import DoppleHeader from "../components/DoppleHeader";
import CameraFeeds from "../components/cams/CameraFeeds";
import OpenDoor from "../components/OpenDoor";
import NextPageButton from "../components/NextPageButton";

const FirstPage = ({ handleNavigate, handleDoorbellEvent }) => {
  return (
    <div>
      <DoppleHeader />
      <div className="dashboard-container">
        <div className="main-content">
          <div className="content">
            <div id="cameraFeeds">
              <CameraFeeds handleNavigate={handleNavigate} handleDoorbellEvent={handleDoorbellEvent} />
            </div>
          </div>
        </div>
        <div className="buttons">
          <OpenDoor doorIndex={1} doorLabel="Open Front Door" />
          <OpenDoor doorIndex={2} doorLabel="Open Back Door" />
          <NextPageButton handleNavigate={() => handleNavigate(2)} />
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
