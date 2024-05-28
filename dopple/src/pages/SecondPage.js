import React from 'react';
import "./SecondPage.css";
import DoppleHeader from "../components/DoppleHeader";
import PrinterStatus from '../components/PrinterStatus';
import OrderStatus from '../components/OrderStatus';
import DashhboardContextProvider from '../contexts/DashboardContextProvider';
import NetworkStatus from '../components/NetworkStatus';
import Back from "../assets/Back.png";
// import ReactPlayer from "react-player";

const SecondPage = () => {
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
    <button href="#">
        <img
          src={Back}
          alt="Arrow for the previous page"
        />
      </button>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
