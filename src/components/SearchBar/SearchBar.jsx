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
  const [returnDate, setReturnDate] = useState(new Date());

  // Función auxiliar para comparar fechas por su valor en YYYY-MM-DD
  const dateEquals = (date1, date2) => {
    if (!date1 && !date2) return true;
    if (!date1 || !date2) return false;
    return (
      date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0]
    );
  };

  // Depuración: Log de initialSearchParams al renderizar ---
  console.log("SearchBar Render: initialSearchParams =", initialSearchParams);
  console.log("SearchBar Render: Current internal state =", {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
  });

  // useEffect para inicializar los estados cuando `initialSearchParams` cambie ---
  useEffect(() => {
    console.log(
      "SearchBar useEffect (initialSearchParams): Triggered. initialSearchParams =",
      initialSearchParams
    );

    if (initialSearchParams) {
      // Origen
      // Solo actualiza si la prop es diferente al estado interno
      if (initialSearchParams.origin !== origin) {
        console.log(
          `SearchBar useEffect: Updating origin from '${origin}' to '${
            initialSearchParams.origin || ""
          }'`
        );
        setOrigin(initialSearchParams.origin || ""); // Si es null/undefined, setear a ""
      }

      // Destino
      if (initialSearchParams.destination !== destination) {
        console.log(
          `SearchBar useEffect: Updating destination from '${destination}' to '${
            initialSearchParams.destination || ""
          }'`
        );
        setDestination(initialSearchParams.destination || "");
      }

      // Pasajeros
      if (initialSearchParams.passengers !== passengers) {
        console.log(
          `SearchBar useEffect: Updating passengers from '${passengers}' to '${
            initialSearchParams.passengers || "1"
          }'`
        );
        setPassengers(initialSearchParams.passengers || "1");
      }

      // Fechas
      let newDepartureDate = null;
      if (initialSearchParams.departureDate) {
        newDepartureDate = new Date(
          initialSearchParams.departureDate + "T00:00:00"
        );
      } else {
        newDepartureDate = new Date();
      }
      if (!dateEquals(departureDate, newDepartureDate)) {
        console.log(
          `SearchBar useEffect: Updating departureDate from '${departureDate}' to '${newDepartureDate}'`
        );
        setDepartureDate(newDepartureDate);
      }

      let newReturnDate = null;
      if (initialSearchParams.returnDate) {
        newReturnDate = new Date(initialSearchParams.returnDate + "T00:00:00");
      } else {
        newReturnDate = new Date(
          newDepartureDate.getTime() + 24 * 60 * 60 * 1000
        );
      }
      if (!dateEquals(returnDate, newReturnDate)) {
        console.log(
          `SearchBar useEffect: Updating returnDate from '${returnDate}' to '${newReturnDate}'`
        );
        setReturnDate(newReturnDate);
      }
    } else {
      console.log(
        "SearchBar useEffect: initialSearchParams is null/empty. Ensuring default states."
      );
      // Si initialSearchParams es nulo, resetear los estados internos a sus valores por defecto si no lo están ya.
      if (origin !== "") setOrigin("");
      if (destination !== "") setDestination("");
      if (passengers !== "1") setPassengers("1");

      const today = new Date();
      if (!dateEquals(departureDate, today)) setDepartureDate(today);
      if (
        !dateEquals(returnDate, new Date(today.getTime() + 24 * 60 * 60 * 1000))
      ) {
        setReturnDate(new Date(today.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  }, [initialSearchParams]); // LA ÚNICA DEPENDENCIA ES initialSearchParams.

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

  const handleExchange = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  const handleSubmit = () => {
    const formatDateToYYYYMMDD = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const newSearchParams = {
      origin: origin,
      destination: destination,
      departureDate: formatDateToYYYYMMDD(departureDate),
      returnDate: formatDateToYYYYMMDD(returnDate),
      passengers: passengers,
    };

    if (onSearch) {
      onSearch(newSearchParams);
    } else {
      const urlSearchParams = new URLSearchParams(newSearchParams);
      navigate(`/flights?${urlSearchParams.toString()}`);
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
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
        <div className="search-fields">
          <div className="field-group">
            <label className="field-label">Origen*</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="field-icon" />
              <select
                value={origin}
                onChange={(e) => {
                  console.log(
                    "SearchBar: Origin select changed to",
                    e.target.value
                  );
                  setOrigin(e.target.value);
                }}
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
          <div className="exchange-button-container">
            <button
              className="exchange-button"
              onClick={handleExchange}
              type="button"
            >
              <FaExchangeAlt />
            </button>
          </div>
          <div className="field-group">
            <label className="field-label">Destino*</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="field-icon" />
              <select
                value={destination}
                onChange={(e) => {
                  console.log(
                    "SearchBar: Destination select changed to",
                    e.target.value
                  );
                  setDestination(e.target.value);
                }}
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
          <div className="field-group">
            <label className="field-label">Salida*</label>
            <div className="input-with-icon date-input">
              <FaCalendarAlt className="field-icon" />
              <DatePicker
                selected={departureDate}
                onChange={(date) => {
                  setDepartureDate(date);
                  if (returnDate && date && returnDate < date) {
                    setReturnDate(
                      new Date(date.getTime() + 24 * 60 * 60 * 1000)
                    );
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
