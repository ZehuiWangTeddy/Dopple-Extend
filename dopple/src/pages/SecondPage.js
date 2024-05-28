import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./SecondPage.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';
import NetworkStatus from '../components/NetworkStatus';

const SecondPage = () => {
  const navigate = useNavigate();

  const handlePreviousPage = () => {
    navigate("/");
  };

  return (
    <DashhboardContextProvider>
    <div className="dashboard-container">
      <DoppleHeader />
      <div className="content">
        <OrderStatus />
        <PrinterStatus />
        <div id="operatorStatus">
          <table>
            <tr>
              <th>Operator Status</th>
            </tr>
            <tr>
              <td>hi</td>
            </tr>
          </table>
        </div>
        <NetworkStatus />
      </div>
    </div>
    <div className="button-container">
      <button className="previous-page-button" onClick={handlePreviousPage}>
          Previous Page
      </button>
    </div>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
