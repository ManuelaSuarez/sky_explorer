import React from "react";
import "./FlightPanel.css";

const FlightPanel = () => {
  return (
    <div className="flightPanel-container">
      <table className="flightPanel-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha de Compra</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha de salida</th>
            <th>Hora de salida</th>
            <th>Hora de llegada</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TF-5829</td>
            <td>30/07/2024</td>
            <td>Rosario</td>
            <td>Posadas</td>
            <td>13/11/2024</td>
            <td>13:45hs</td>
            <td>16:30hs</td>
            <td>Inactivo</td>
          </tr>
          <tr>
            <td>TF-5850</td>
            <td>08/08/2024</td>
            <td>Posadas</td>
            <td>Rosario</td>
            <td>20/11/2024</td>
            <td>13:45hs</td>
            <td>16:30hs</td>
            <td>Inactivo</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FlightPanel;
