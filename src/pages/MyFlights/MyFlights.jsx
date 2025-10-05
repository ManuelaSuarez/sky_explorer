import React from "react";
import FlightPanel from "../../components/FlightPanel/FlightPanel.jsx";
import "./MyFlights.css";
import { useNavigate } from "react-router-dom";

const MyFlights = ({ setModalVisible }) => {
  const navigate = useNavigate();

  return (
    <div className="myFlights-container">
      <h2>Mis Vuelos</h2>
      <p>Explorá tu historial de vuelos</p>
      <FlightPanel setModalVisible={setModalVisible} />{" "}
      <button onClick={() => navigate("/")} className="myFlights-button">
        Comprar vuelos
      </button>
    </div>
  );
};

export default MyFlights;
