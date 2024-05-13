import React, { useContext } from 'react';

import DashboardContext from '../contexts/DashboardContext';
import servicesLogo from '../assets/server.png';

const NetworkStatus = () => {
    const { networkServiceData } = useContext(DashboardContext);

    return (
        <div id="networkServices">
          <h3>Network Services <img src={servicesLogo} alt="Server icon that represents the network services" /></h3>
          <div className='networkFlow'>
            {networkServiceData}
          </div>
        </div>
    )
};

export default NetworkStatus;