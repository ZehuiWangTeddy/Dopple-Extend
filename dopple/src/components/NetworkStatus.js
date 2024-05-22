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
          <h3>Network Services <img src={servicesLogo} alt="Server icon that represents the network services" /></h3>
          { getBody() }
        </div>
    )
};

export default NetworkStatus;