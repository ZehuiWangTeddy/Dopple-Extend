import React from 'react';
import "./Dashboard.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';
import NetworkStatus from '../components/NetworkStatus';

const Dashboard = () => {

  return (
    <DashhboardContextProvider>
    <div className="dashboard-container">
      <DoppleHeader />
      <div className="content">
        <div id="cameraFeeds">
          <h3>Camera View</h3>
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