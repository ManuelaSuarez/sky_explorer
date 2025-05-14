import React from "react";
import FlightPanel from "../../components/FlightPanel/FlightPanel.jsx";
import "./MyFlights.css";

const MyFlights = () => {
  return (
    <div className="myFlights-container">
      <h2>Mis Vuelos</h2>
      <p>Explorá tu historial de vuelos</p>
      <FlightPanel />
      <button className="myFlights-button">
        <a href="#">Comprar vuelos</a>
      </button>
    </div>
  );
};

export default MyFlights;
