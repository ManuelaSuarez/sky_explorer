import React from "react";
import "./Destinations.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const Destinations = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`destinations-container ${isDark ? "dark" : ""}`}>
      <div className="destinations-card">
        <i className="fa-solid fa-compass destinations-icon"></i>
        <h1 className="destinations-title">Sección en construcción</h1>
        <p className="destinations-text">
          Estamos trabajando en esta sección para ofrecerte una mejor experiencia.
          Muy pronto podrás explorar los destinos más populares y descubrir nuevas
          ofertas de vuelos con Sky Explorer.
        </p>
        <button
          className="destinations-button"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Destinations;
