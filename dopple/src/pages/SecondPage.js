// src/pages/SecondPage.js
import React from 'react';
import "./SecondPage.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';
import NetworkStatus from '../components/NetworkStatus';
import ChiselServer from '../components/ChiselServer';
import PreviousPageButton from "../components/PreviousPageButton";
import { useFeature } from '../contexts/FeatureContext';

const SecondPage = ({ handleNavigate }) => {
  const { features } = useFeature();

  return (
    <DashhboardContextProvider>
      <div className="dashboard-container">
        <DoppleHeader />
        <div className="second-content">
          {features.OrderStatus && <OrderStatus />}
          {features.PrinterStatus && <PrinterStatus />}
          {features.NetworkServices && <NetworkStatus />}
          {features.OperatorStatus && <ChiselServer />}
          <div className="button-container">
            <PreviousPageButton handleNavigate={() => handleNavigate(1)} />
          </div>
        </div>
      </div>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
