import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import "./SearchBar.css";

const SearchBar = ({ buttonText, onSearch, initialSearchParams }) => {
  const navigate = useNavigate();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const airports = [
    "Bahía Blanca (BHI)", "Bariloche (BRC)", "Buenos Aires (BUE)",
    "Catamarca (CTC)", "Comodoro Rivadavia (CRD)", "Corrientes (CNQ)",
    "Córdoba (COR)", "El Calafate (FTE)", "El Palomar (EPA)",
    "Ezeiza (EZE)", "Formosa (FMA)", "Jujuy (JUJ)", "Junín (JNI)",
    "La Plata (LPG)", "La Rioja (IRJ)", "Mar del Plata (MDQ)",
    "Mendoza (MDZ)", "Morón (MOR)", "Necochea (NEC)", "Neuquén (NQN)",
    "Olavarría (OVR)", "Paraná (PRA)", "Posadas (PSS)",
    "Puerto Iguazú (IGR)", "Resistencia (RES)", "Río Cuarto (RCU)",
    "Río Gallegos (RGL)", "Río Grande (RGA)", "Rosario (ROS)",
    "Salta (SLA)", "San Fernando (FDO)", "San Juan (UAQ)",
    "San Luis (LUQ)", "San Rafael (AFA)", "Santa Rosa (RSA)",
    "Santa Teresita (STT)", "Santiago del Estero (SDE)", "Tandil (TDL)",
    "Trelew (REL)", "Tucumán (TUC)", "Ushuaia (USH)", "Villa Gesell (VLG)",
  ];

  const createDateFromString = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString + "T00:00:00");
  };

  const getTomorrow = (fromDate = new Date()) => {
    const tomorrow = new Date(fromDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

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

  const handleExchange = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  const handleDepartureChange = (date) => {
    setDepartureDate(date);
    if (returnDate && date && returnDate < date) {
      setReturnDate(getTomorrow(date));
    }
  };

const handleSubmit = () => {
  if (origin === destination) {
    alert("El origen y el destino no pueden ser iguales.");
    return;
  }

  // ✅ CORREGIDO: Formatear fecha SIN UTC conversion
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
    <div className="sb-container">
      <h2 className="sb-title">Buscá el destino con el que más soñaste</h2>
      <div className="sb-bar">
        <div className="sb-options">
          <div className="sb-trip-type">
            <p>Ida y vuelta</p>
          </div>
          <div className="sb-passengers">
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

        <div className="sb-fields">
          <div className="sb-field-group">
            <label className="sb-label">Origen*</label>
            <div className="sb-input-wrapper">
              <FaMapMarkerAlt className="sb-icon" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="sb-select"
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

          <div className="sb-exchange-container">
            <button
              className="sb-exchange-btn"
              onClick={handleExchange}
              type="button"
            >
              <FaExchangeAlt />
            </button>
          </div>

          <div className="sb-field-group">
            <label className="sb-label">Destino*</label>
            <div className="sb-input-wrapper">
              <FaMapMarkerAlt className="sb-icon" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="sb-select"
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

          <div className="sb-field-group">
            <label className="sb-label">Salida*</label>
            <div className="sb-input-wrapper sb-date">
              <FaCalendarAlt className="sb-icon" />
              <DatePicker
                selected={departureDate}
                onChange={handleDepartureChange}
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={new Date()}
                className="sb-datepicker"
              />
            </div>
          </div>

          <div className="sb-field-group">
            <label className="sb-label">Regreso*</label>
            <div className="sb-input-wrapper sb-date">
              <FaCalendarAlt className="sb-icon" />
              <DatePicker
                selected={returnDate}
                onChange={setReturnDate}
                dateFormat="dd/MM/yyyy"
                locale={es}
                minDate={departureDate || new Date()}
                className="sb-datepicker"
              />
            </div>
          </div>

          <button
            className="sb-search-btn"
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