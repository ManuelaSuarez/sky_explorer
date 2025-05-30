import { useState, useEffect } from "react"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import "./FlightFilters.css"

const FlightFilters = ({ 
  onAirlineFilterChange, 
  availableAirlines = []
}) => {
  const [airlinesOpen, setAirlinesOpen] = useState(true)
  const [selectedAirlines, setSelectedAirlines] = useState([])

  // Efecto para notificar cambios en aerolíneas al componente padre
  useEffect(() => {
    if (onAirlineFilterChange) {
      onAirlineFilterChange(selectedAirlines);
    }
  }, [selectedAirlines, onAirlineFilterChange]);

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

  const resetAirlineFilters = () => {
    setSelectedAirlines([]);
  };

  return (
    <div className="flight-filters">
      {/* Filtro de Aerolíneas */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setAirlinesOpen(!airlinesOpen)}>
          <h3>Aerolíneas</h3>
          {airlinesOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

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
          <button 
            onClick={resetAirlineFilters}
            className="reset-filters-btn"
          >
            Limpiar filtros de aerolíneas
          </button>
          
          <div className="active-filters">
            <h4>Aerolíneas seleccionadas:</h4>
            <div className="active-filter">
              <span>{selectedAirlines.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlightFilters