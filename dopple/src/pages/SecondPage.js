import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./SecondPage.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';
import NetworkStatus from '../components/NetworkStatus';
import ChiselServer from '../components/ChiselServer';

const SecondPage = () => {
  const navigate = useNavigate();

  const handlePreviousPage = () => {
    navigate("/");
  };

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
          <button className="previous-page-button" onClick={handlePreviousPage}>
              Previous Page
          </button>
        </div>
      </div>
    </div>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
