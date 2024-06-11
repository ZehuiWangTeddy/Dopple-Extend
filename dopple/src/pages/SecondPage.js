import React from 'react';
import "./SecondPage.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';
import NetworkStatus from '../components/NetworkStatus';
import ChiselServer from '../components/ChiselServer';
import PerviousPageButton from "../components/PerviousPageButton";

const SecondPage = () => {

  return (
    <DashhboardContextProvider>
    <div className="dashboard-container">
      <DoppleHeader />
      <div className="second-content">
        <OrderStatus />
        <PrinterStatus />
        <ChiselServer />
        <NetworkStatus />
        <div className="button-container">
          <PerviousPageButton link="/"></PerviousPageButton>
        </div>
      </div>
    </div>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
