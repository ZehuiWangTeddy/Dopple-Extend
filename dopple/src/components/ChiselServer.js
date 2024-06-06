import React, { useContext } from 'react';

import "./ChiselServer.css";
import DashboardContext from '../contexts/DashboardContext';
import DoppleLoader from './DoppleLoader';

const ChiselServer = () => {
    const { chiselServerData, chiselServerLoading } = useContext(DashboardContext);

    function getBody()
    {
      if(chiselServerLoading || chiselServerLoading.length === 0) {
        return <DoppleLoader />
      }

      return <div>{chiselServerData}</div>
        
    }

    return (
        <div id="operatorStatus">
          <h3>Operator Status</h3>
          { getBody() }
        </div>
    )
};

export default ChiselServer;