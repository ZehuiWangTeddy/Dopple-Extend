// src/pages/FirstPage.js
import React from "react";
import "./FirstPage.css";
import DoppleHeader from "../components/DoppleHeader";
import CameraFeeds from "../components/cams/CameraFeeds";
import OpenDoor from "../components/OpenDoor";
import NextPageButton from "../components/NextPageButton";
import ConfigPageButton from "../components/ConfigPageButton";

const FirstPage = ({ handleNavigate }) => {
  return (
    <div className="dashboard-container">
      <DoppleHeader />
        <div className="main-content">
          <div className="content">
            <div id="cameraFeeds">
              <CameraFeeds />
            </div>
          </div>
        </div>
        <div className="buttons">
          <ConfigPageButton />
          <OpenDoor doorIndex={1} doorLabel="Open Front Door" />
          <OpenDoor doorIndex={2} doorLabel="Open Back Door" />
          <NextPageButton handleNavigate={() => handleNavigate(2)} />
        </div>
    </div>
  );
};

export default FirstPage;
