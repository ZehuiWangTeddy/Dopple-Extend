import React, { useState, useEffect } from 'react';
import DashboardContext from './DashboardContext';

const DashhboardContextProvider = ({ children }) => {

    const [printerLoading, setPrinterLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(true);
    const [networkServiceLoading, setNetworkServiceLoading] = useState(true);

    const [printerData, setPrinterData] = useState([]);
    const [orderData, setOrderData] = useState({});
    const [networkServiceData, setNetworkServiceData] = useState([]);
    const [companyData, setCompanyData] = useState([]);

    const completed = 'completed';
    const confirmed = 'confirmed';
    const created = 'created';
    const inProduction = 'in_production';
    const locked = 'locked';
    const shipped = 'shipped';
    const statusData = [created, locked, confirmed, inProduction, shipped, completed];

    useEffect(() => {

        const SERVER_HOST = process.env.REACT_APP_BASHBOARD_API_URL;

        const serviceStatusLabel = (status) => {
            switch (status) {
                case 'ONLINE':
                    return 'online';
                case 'OFFLINE':
                    return 'offline';
                case 'WARNING':
                    return 'warning';
                default:
                    return 'unknown';
            }
        }
    
        function parsePrinterData(data) {
            const printerStatus = Object.keys(data.values)
                .filter((key) => key.startsWith("printer"))
                .map((key) => ({
                    id: key,
                    no: key.split("_")[1],
                    status: data.values[key],
                }));
            setPrinterData(printerStatus);
        }
    
        function parseOrderData(orderDatas) {
            let companies = [];
            let cleanData = {};
            Object.keys(orderDatas.values).forEach((key) => {
                let splitKey = key.split("_");
                let company = splitKey[2];
                let status = key
                    .replace("total_orders_", "")
                    .replace(company + "_", "");
    
                if (!companies.includes(company)) {
                    companies.push(company);
                }
    
                cleanData[company] = {
                    ...cleanData[company],
                    [status]: orderDatas.values[key]
                }
            });
    
            setCompanyData(companies);
            setOrderData(cleanData);
        }
    
        function parseNetworkServiceData(orderDatas) {
            let services = Object.keys(orderDatas.values).map((key) => {
                let name = key.replace('_status', '');
                name = name.split('_').map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(' ');
                return (
                    <div key={key} className={`networkItem ${serviceStatusLabel(orderDatas.values[key])}`} > {name} {orderDatas.values[key]}</div>
                )
            });
            setNetworkServiceData(services);
        }

        const es = new EventSource(SERVER_HOST);
        es.onopen = () => {
            console.log(">>> Connection opened!");
            // setLoading(false);
        };
        es.onerror = (e) => {
            console.log("ERROR!", e);
            setOrderLoading(true);
            setPrinterLoading(true);
            setNetworkServiceLoading(true);
        }

        es.addEventListener("mqtt_message", (e) => {
            const body = JSON.parse(e.data);

            const topic = body.topic;
            const message = body.data;

            let topicParts = topic.split("/");
            let type = topicParts[1];

            const data = JSON.parse(message.toString());

            if (type === "PRADA") {
                parsePrinterData(data);
                setPrinterLoading(false);
            }
            if (type === "ORDER-PORTAL") {
                parseOrderData(data);
                setOrderLoading(false);
            }
            if (type === 'STATUS-REPORTER') {
                parseNetworkServiceData(data);
                setNetworkServiceLoading(false);
            }
        });

        return () => es.close();

    }, []);

    return (
        <DashboardContext.Provider value={{ printerData, orderData, networkServiceData, companyData, statusData, orderLoading, networkServiceLoading, printerLoading }}>
            {children}
        </DashboardContext.Provider>
    );
}

export default DashhboardContextProvider;