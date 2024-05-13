import React, { useContext } from 'react';

import printersLogo from '../assets/3dPrinters.png';
import DashboardContext from '../contexts/DashboardContext';

const PrinterStatus = () => {
    const { printerData } = useContext(DashboardContext);

    return (
        <div id="printers">
          <h3>
            3D Printer Status{" "}
            <img
              src={printersLogo}
              alt="Chip icon that represents the printers"
            />
          </h3>
          <table>
            <tbody>
              <tr>
                <th>Printer No</th>
                <th className="columnPrinterStatus">Status</th>
              </tr>
              {printerData.map((printer) => (
                <tr key={printer.id}>
                  <td>{printer.no}</td>
                  <td className="columnPrinterStatus">
                    <div
                      className="printer-status"
                      style={{
                        backgroundColor:
                          printer.status === "FREE"
                            ? "#3f2"
                            : printer.status === "PRINTING"
                              ? "#ACA45E"
                              : "red",
                      }}
                    >
                      {printer.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
};

export default PrinterStatus;