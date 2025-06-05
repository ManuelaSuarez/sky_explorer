import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import "./SearchBar.css";

const SearchBar = ({ buttonText, onSearch, initialSearchParams }) => {
  const navigate = useNavigate();

  // Estados del formulario
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  // Lista de aeropuertos
  const airports = [
    "Bahía Blanca (BHI)",
    "Bariloche (BRC)",
    "Buenos Aires (BUE)",
    "Catamarca (CTC)",
    "Comodoro Rivadavia (CRD)",
    "Corrientes (CNQ)",
    "Córdoba (COR)",
    "El Calafate (FTE)",
    "El Palomar (EPA)",
    "Ezeiza (EZE)",
    "Formosa (FMA)",
    "Jujuy (JUJ)",
    "Junín (JNI)",
    "La Plata (LPG)",
    "La Rioja (IRJ)",
    "Mar del Plata (MDQ)",
    "Mendoza (MDZ)",
    "Morón (MOR)",
    "Necochea (NEC)",
    "Neuquén (NQN)",
    "Olavarría (OVR)",
    "Paraná (PRA)",
    "Posadas (PSS)",
    "Puerto Iguazú (IGR)",
    "Resistencia (RES)",
    "Río Cuarto (RCU)",
    "Río Gallegos (RGL)",
    "Río Grande (RGA)",
    "Rosario (ROS)",
    "Salta (SLA)",
    "San Fernando (FDO)",
    "San Juan (UAQ)",
    "San Luis (LUQ)",
    "San Rafael (AFA)",
    "Santa Rosa (RSA)",
    "Santa Teresita (STT)",
    "Santiago del Estero (SDE)",
    "Tandil (TDL)",
    "Trelew (REL)",
    "Tucumán (TUC)",
    "Ushuaia (USH)",
    "Villa Gesell (VLG)",
  ];

  // Función para crear fecha desde string YYYY-MM-DD
  const createDateFromString = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString + "T00:00:00");
  };

  // Función para obtener mañana
  const getTomorrow = (fromDate = new Date()) => {
    const tomorrow = new Date(fromDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // Sincronizar con parámetros iniciales
  useEffect(() => {
    if (initialSearchParams) {
      setOrigin(initialSearchParams.origin || "");
      setDestination(initialSearchParams.destination || "");
      setPassengers(initialSearchParams.passengers || "1");

      const newDepartureDate =
        createDateFromString(initialSearchParams.departureDate) || new Date();
      const newReturnDate =
        createDateFromString(initialSearchParams.returnDate) ||
        getTomorrow(newDepartureDate);

      setDepartureDate(newDepartureDate);
      setReturnDate(newReturnDate);
    }
  }, [initialSearchParams]);

  // Intercambiar origen y destino
  const handleExchange = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  // Manejar cambio de fecha de salida
  const handleDepartureChange = (date) => {
    setDepartureDate(date);
    // Si la fecha de regreso es anterior a la nueva fecha de salida, ajustarla
    if (returnDate && date && returnDate < date) {
      setReturnDate(getTomorrow(date));
    }
  };

  // Enviar búsqueda
  const handleSubmit = () => {
    if (origin === destination) {
      alert("El origen y el destino no pueden ser iguales.");
      return;
    }

    const formatDate = (date) => date?.toISOString().split("T")[0] || "";

    const searchParams = {
      origin,
      destination,
      departureDate: formatDate(departureDate),
      returnDate: formatDate(returnDate),
      passengers,
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const urlParams = new URLSearchParams(searchParams);
      navigate(`/flights?${urlParams.toString()}`);
    }
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
            <select
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num.toString()}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-fields">
          {/* Origen */}
          <div className="field-group">
            <label className="field-label">Origen*</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="field-icon" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="airport-select"
              >
                <option value="">Seleccione Origen</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>
                    {airport}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón intercambiar */}
          <div className="exchange-button-container">
            <button
              className="exchange-button"
              onClick={handleExchange}
              type="button"
            >
              <FaExchangeAlt />
            </button>
          </div>

          {/* Destino */}
          <div className="field-group">
            <label className="field-label">Destino*</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="field-icon" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="airport-select"
              >
                <option value="">Seleccione Destino</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>
                    {airport}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha de salida */}
          <div className="field-group">
            <label className="field-label">Salida*</label>
            <div className="input-with-icon date-input">
              <FaCalendarAlt className="field-icon" />
              <DatePicker
                selected={departureDate}
                onChange={handleDepartureChange}
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={new Date()}
                className="datepicker-input"
              />
            </div>
          </div>

          {/* Fecha de regreso */}
          <div className="field-group">
            <label className="field-label">Regreso*</label>
            <div className="input-with-icon date-input">
              <FaCalendarAlt className="field-icon" />
              <DatePicker
                selected={returnDate}
                onChange={setReturnDate}
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={departureDate || new Date()}
                className="datepicker-input"
              />
            </div>
          </div>

          {/* Botón buscar */}
          <button
            className="search-button"
            onClick={handleSubmit}
            type="button"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
