// MyFlights.jsx
import React from "react";
import FlightPanel from "../../components/FlightPanel/FlightPanel.jsx";
import "./MyFlights.css";
import { useNavigate } from "react-router-dom";

const MyFlights = ({ setModalVisible }) => { // Accept setModalVisible as a prop
  const navigate = useNavigate();

  return (
    <div className="myFlights-container">
      <h2>Mis Vuelos</h2>
      <p>Explorá tu historial de vuelos</p>
      <FlightPanel setModalVisible={setModalVisible} /> {/* Pass setModalVisible to FlightPanel */}
      <button onClick={() => navigate("/")} className="myFlights-button">
        Comprar vuelos
      </button>
    </div>
  );
};

export default MyFlights;