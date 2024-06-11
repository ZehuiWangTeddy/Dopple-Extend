import React, { useState, useEffect } from 'react';
import DashboardContext from './DashboardContext';

const DashhboardContextProvider = ({ children }) => {

    const [printerLoading, setPrinterLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(true);
    const [networkServiceLoading, setNetworkServiceLoading] = useState(true);
    const [chiselServerLoading, setChiselServerLoading] = useState(true);

    const [printerData, setPrinterData] = useState([]);
    const [orderData, setOrderData] = useState({});
    const [networkServiceData, setNetworkServiceData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [chiselServerData, setChiselServerData] = useState({});

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
            const printerStatus = Object.keys(data.state.values)
                .filter((key) => key.startsWith("printer"))
                .map((key) => ({
                    id: key,
                    no: key.split("_")[1],
                    status: data.state.values[key],
                }));
            setPrinterData(printerStatus);
        }

        function parseOrderData(orderDatas) {
            let companies = [];
            let cleanData = {};
            Object.keys(orderDatas.state.values).forEach((key) => {
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
                    [status]: orderDatas.state.values[key]
                }
            });

            setCompanyData(companies);
            setOrderData(cleanData);
        }

        function parseNetworkServiceData(networkServiceDatas) {
            console.log(networkServiceDatas);
            let services = Object.keys(networkServiceDatas.state.values).map((key) => {
                let name = key.replace('_status', '');
                name = name.split('_').map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(' ');
                return (
                    <div key={key} className={`networkItem ${serviceStatusLabel(networkServiceDatas.state.values[key])}`} > {name} {networkServiceDatas.state.values[key]}</div>
                )
            });
            setNetworkServiceData(services);
        }

        function parseChiselServerData(data) {
            let datas = Object.keys(data.state.values).map((key) => {
                let name = key.split('_').map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(' ');

                return {
                    label: name,
                    value: data.state.values[key]
                }
            })

            const normalItems = datas.filter(item => !Array.isArray(item.value));
            const arrayItems = datas.filter(item => Array.isArray(item.value));

            const tableView = ({ normalItems, arrayItems }) => {
                let ds = normalItems.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.label}</td>
                            <td>{item.value}</td>
                        </tr>
                    );
                });

                let tags = arrayItems.map((item) => {
                    let values = item.value.map((value) => {
                        return (
                            <span className='chiselItem'>{value}</span>
                        );
                    });
                    return (
                        <div>
                            <h3>{item.label}</h3>
                            <div className='chiselStatus'>
                                {values}
                            </div>
                        </div>
                    )
                });

                return (
                    <div>
                        <table>
                            <tbody>
                                {ds}
                            </tbody>
                        </table>
                        {tags}
                    </div>
                );
            };

            setChiselServerData(
                tableView({ normalItems:normalItems, arrayItems:arrayItems })
            );
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

            if (type === "PRADA") {
                const data = JSON.parse(message.toString());
                parsePrinterData(data);
                setPrinterLoading(false);
            }
            if (type === "ORDER-PORTAL") {
                const data = JSON.parse(message.toString());
                parseOrderData(data);
                setOrderLoading(false);
            }
            if (type === 'STATUS-REPORTER') {
                const data = JSON.parse(message.toString());
                parseNetworkServiceData(data);
                setNetworkServiceLoading(false);
            }

            if (type === 'CHISEL-SERVER') {
                const data = JSON.parse(message.toString());
                parseChiselServerData(data);
                setChiselServerLoading(false);
            }
        });

        return () => es.close();

    }, []);

    return (
        <DashboardContext.Provider value={{ printerData, orderData, networkServiceData, companyData, statusData, chiselServerData, orderLoading, networkServiceLoading, printerLoading, chiselServerLoading }}>
            {children}
        </DashboardContext.Provider>
    );
}

export default DashhboardContextProvider;