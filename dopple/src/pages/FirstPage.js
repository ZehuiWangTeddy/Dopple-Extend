import React from "react";
import "./FirstPage.css";
import DoppleHeader from "../components/DoppleHeader";
import CameraFeeds from "../components/cams/CameraFeeds";
import OpenDoor from "../components/OpenDoor";
import NextPageButton from "../components/NextPageButton";

const FirstPage = () => {

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
      </div>
      <div className="buttons">
        <OpenDoor doorIndex={1} doorLabel="Open Front Door" />
        <OpenDoor doorIndex={2} doorLabel="Open Back Door" />
        <NextPageButton link="/stats"></NextPageButton>
      </div>
    </div>
    </div>
  );
};

export default FirstPage;
