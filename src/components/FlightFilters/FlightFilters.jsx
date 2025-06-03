import { useState, useEffect } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import "./FlightFilters.css";

const FlightFilters = ({
  // Recibe las siguientes 2 props del padre
  onAirlineFilterChange, // callback que se llama cuando se seleccionan/deseleccionan aerolíneas
  availableAirlines = [], // Lista de aerolíneas disponibles
}) => {
  // Seteo de estados
  const [airlinesOpen, setAirlinesOpen] = useState(true); // Abre y cierra el filtro de aerolíneas
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  // Notifica cambios en aerolíneas seleccionadas al padre
  useEffect(() => {
    if (onAirlineFilterChange) {
      onAirlineFilterChange(selectedAirlines);
    }
  }, [selectedAirlines, onAirlineFilterChange]);

  // Gestiona los checkbox
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedAirlines((prevSelectedAirlines) => {
      if (checked) {
        return [...prevSelectedAirlines, value];
      } else {
        return prevSelectedAirlines.filter((airline) => airline !== value);
      }
    });
  };

  // Limpia los filtros y vacía el array selectedAirlines
  const resetAirlineFilters = () => {
    setSelectedAirlines([]);
  };

  return (
    <div className="flight-filters">
      <div className="filter-section">
        {/* Sección para abrir y cerrar filtros al hacer click */}
        <div
          className="filter-header"
          onClick={() => setAirlinesOpen(!airlinesOpen)}
        >
          <h3>Aerolíneas</h3>
          {airlinesOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {/* Si airlinesOpen es true, muestra los filtros */}
        {airlinesOpen && (
          <div className="filter-options">
            {availableAirlines.length > 0 ? (
              availableAirlines.map((airlineName) => (
                <label className="filter-option" key={airlineName}>
                  <input
                    type="checkbox"
                    name="airline"
                    value={airlineName}
                    checked={selectedAirlines.includes(airlineName)}
                    onChange={handleCheckboxChange}
                  />
                  <span>{airlineName}</span>
                </label>
              ))
            ) : (
              <p className="no-options">Cargando aerolíneas...</p>
            )}
          </div>
        )}
      </div>

      {/* Botón para limpiar filtros y mostrar filtros activos */}
      {selectedAirlines.length > 0 && (
        <div className="filter-actions">
          <button onClick={resetAirlineFilters} className="reset-filters-btn">
            Limpiar filtros de aerolíneas
          </button>

          <div className="active-filters">
            <h4>Aerolíneas seleccionadas:</h4>
            <div className="active-filter">
              <span>{selectedAirlines.join(", ")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightFilters;
