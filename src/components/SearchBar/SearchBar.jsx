import { FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt } from "react-icons/fa"
import "./SearchBar.css"

const SearchBar = ({ buttonText }) => {
  return (
    <div className="search-container">
      <h2 className="search-title">Buscá el destino con el que más soñaste</h2>
      <div className="search-bar">
        <div className="search-options">
          <div className="trip-type">
            <p>Ida y vuelta</p>
          </div>
          <div className="passengers-dropdown">
            <p>Cantidad pasajeros</p>
            <select>
              <option value="one">1</option>
              <option value="two">2</option>
              <option value="three">3</option>
              <option value="four">4</option>
            </select>
          </div>
        </div>

        <div className="search-fields">
          <div className="field-group">
            <label className="field-label">Destino*</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="field-icon" />
              <input type="text" value="Buenos Aires (BUE)" readOnly />
            </div>
          </div>

          <div className="exchange-button-container">
            <button className="exchange-button">
              <FaExchangeAlt />
            </button>
          </div>

          <div className="field-group">
            <label className="field-label">Origen*</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="field-icon" />
              <input type="text" value="Catamarca (CTC)" readOnly />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Salida*</label>
            <div className="input-with-icon">
              <FaCalendarAlt className="field-icon" />
              <input type="text" value="11/09/2024" readOnly />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Regreso*</label>
            <div className="input-with-icon">
              <FaCalendarAlt className="field-icon" />
              <input type="text" value="21/09/2024" readOnly />
            </div>
          </div>

          <button className="search-button">{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

