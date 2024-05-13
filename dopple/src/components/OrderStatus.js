import React, { useContext } from 'react';

import DashboardContext from '../contexts/DashboardContext';

const OrderStatus = () => {
    const { companyData, statusData, orderData } = useContext(DashboardContext);

    const toHump = (name) => {
        return name.replace(/_(\w)/g, function (all, letter) {
            return letter.toUpperCase();
        });
    }

    function getTableBody() {
        if (companyData.length === 0) {
            return 'No data available.'
        }

        return <tr>
            {companyData.map((company) => (
                <th key={company}>{company}</th>
            ))}
            <th>Status</th>
        </tr>
    }

    function getOrderData()
    {
        if (companyData.length === 0) {
            return 
        }
        return statusData.map((key, index) => (
            <tr key={index} className='statusLast'>
                {companyData.map((company) => (
                    <td className="numberfield" key={company}>
                        {orderData[company][key] || 0}
                    </td>
                ))}
                <td>
                    <div className="columnOrderStatus">{toHump(key)}</div>
                </td>
            </tr>
        ))
    }

return (
    <div id="orderStatus">
        <table>
            <tbody>
                {getTableBody() }
                { getOrderData() }
            </tbody>
        </table>
    </div>
)
}

export default OrderStatus;