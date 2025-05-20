import { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import "./SearchBar.css";

const SearchBar = ({ buttonText }) => {
  const [departureDate, setDepartureDate] = useState(new Date("2024/09/11"));
  const [returnDate, setReturnDate] = useState(new Date("2024/09/21"));
  
  // Formato para mostrar la fecha como DD/MM/YYYY
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
            <label className="field-label">Origen*</label>
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
            <label className="field-label">Destino*</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="field-icon" />
              <input type="text" value="Catamarca (CTC)" readOnly />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Salida*</label>
            <div className="input-with-icon date-input">
              <FaCalendarAlt className="field-icon" />
              <DatePicker
                selected={departureDate}
                onChange={(date) => {
                  setDepartureDate(date);
                  // Si la fecha de regreso es anterior a la nueva fecha de salida, actualiza la fecha de regreso
                  if (returnDate < date) {
                    setReturnDate(new Date(date.getTime() + 24 * 60 * 60 * 1000)); // día siguiente
                  }
                }}
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={new Date()}
                className="datepicker-input"

              />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Regreso*</label>
            <div className="input-with-icon date-input">
              <FaCalendarAlt className="field-icon" />
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={departureDate || new Date()}
                className="datepicker-input"

              />
            </div>
          </div>
          <button className="search-button">{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;