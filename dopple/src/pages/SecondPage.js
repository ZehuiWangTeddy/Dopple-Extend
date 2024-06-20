import React from 'react';
import "./SecondPage.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import NetworkStatus from '../components/NetworkStatus';
import OperatorStatus from '../components/ChiselServer';
import PreviousPageButton from "../components/PreviousPageButton";
import ConfigPageButton from '../components/ConfigPageButton';
import { useFeature } from '../contexts/FeatureContext';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';

const SecondPage = ({ handleNavigate }) => {
  const { features } = useFeature();

  return (
    <DashhboardContextProvider>
      <div className="dashboard-container">
        <DoppleHeader />
        <div className="second-content">
          {features.OrderStatus && <OrderStatus />}
          {features.PrinterStatus && <PrinterStatus />}
          {features.OperatorStatus && <OperatorStatus />}
          {features.NetworkServices && <NetworkStatus />}
          <div className="buttons">
            <PreviousPageButton handleNavigate={() => handleNavigate(1)} />
            <ConfigPageButton />
          </div>
        </div>
      </div>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
