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
          {features.OperatorStatus && <ChiselServer />}
          {features.NetworkServices && <NetworkStatus />}
        </div>
        <div className="button-container">
          <PreviousPageButton handleNavigate={() => handleNavigate(1)} />
        </div>
      </div>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
