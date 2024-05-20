import React from 'react';
import "./Dashboard.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';
import NetworkStatus from '../components/NetworkStatus';
import CameraFeeds from '../components/cams/CameraFeeds'; 
import mqtt from 'mqtt';


const Dashboard = () => {

  return (
    <DashhboardContextProvider>
    <div className="dashboard-container">
      <DoppleHeader />
      <div className="content"> 
        <div id="cameraFeeds"> 
           <CameraFeeds />
        </div>
        <PrinterStatus />
        <OrderStatus />
        <NetworkStatus />
      </div>
    </div>
    </DashhboardContextProvider>
  );
};

export default Dashboard;