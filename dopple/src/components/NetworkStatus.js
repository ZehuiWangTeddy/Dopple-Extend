import React, { useContext } from 'react';

import DashboardContext from '../contexts/DashboardContext';
import servicesLogo from '../assets/server.png';
import DoppleLoader from './DoppleLoader';

const NetworkStatus = () => {
    const { networkServiceData, networkServiceLoading } = useContext(DashboardContext);

    function getBody()
    {
      if(networkServiceLoading || networkServiceData.length === 0) {
        return <DoppleLoader />
      }

      return <div className='networkFlow'>
        {networkServiceData}
      </div>
    }

    return (
        <div id="networkServices">
          <div id="networkTitle">
            <h3>Network Services</h3>
            <img src={servicesLogo} alt="Server icon that represents the network services" />
          </div>
          { getBody() }
        </div>
    )
};

export default NetworkStatus;