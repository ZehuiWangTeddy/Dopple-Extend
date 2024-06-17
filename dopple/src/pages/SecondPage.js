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

  const gridTemplateAreas = () => {
    const areas = [];
    if (features.OrderStatus) areas.push('orderStatus');
    if (features.PrinterStatus) areas.push('printers');
    if (features.OperatorStatus) areas.push('operatorStatus');
    if (features.NetworkServices) areas.push('networkServices');

    if (areas.length === 1) {
      return `'${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]}' ' ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]}' ' ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]}' ' ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]}'`;
    }
    if (areas.length === 2) {
      return `'${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[1]} ${areas[1]}' '${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[1]} ${areas[1]}' '${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[1]} ${areas[1]}' '${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[1]} ${areas[1]}'`;
    }
    if (areas.length === 3) {
      return `'${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[1]} ${areas[1]}' '${areas[0]} ${areas[0]} ${areas[0]} ${areas[0]} ${areas[1]} ${areas[1]}' '${areas[2]} ${areas[2]} ${areas[2]} ${areas[2]} ${areas[2]} ${areas[2]}' '${areas[2]} ${areas[2]} ${areas[2]} ${areas[2]} ${areas[2]} ${areas[2]}'`;
    }
    return `'orderStatus orderStatus orderStatus orderStatus printers printers' 'orderStatus orderStatus orderStatus orderStatus printers printers' 'operatorStatus operatorStatus operatorStatus operatorStatus networkServices networkServices' 'operatorStatus operatorStatus operatorStatus operatorStatus networkServices networkServices'`;
  };

  return (
    <DashhboardContextProvider>
      <div className="dashboard-container">
        <div className="header">
          <DoppleHeader />
        </div>
        <div className="second-content" style={{ gridTemplateAreas: gridTemplateAreas() }}>
          {features.OrderStatus && <div className="grid-item" style={{ gridArea: 'orderStatus' }}><OrderStatus /></div>}
          {features.PrinterStatus && <div className="grid-item" style={{ gridArea: 'printers' }}><PrinterStatus /></div>}
          {features.OperatorStatus && <div className="grid-item" style={{ gridArea: 'operatorStatus' }}><ChiselServer /></div>}
          {features.NetworkServices && <div className="grid-item" style={{ gridArea: 'networkServices' }}><NetworkStatus /></div>}
        </div>
        <div className="button-container">
          <PreviousPageButton handleNavigate={() => handleNavigate(1)} />
        </div>
      </div>
    </DashhboardContextProvider>
  );
};

export default SecondPage;
