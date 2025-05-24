import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import FlightResults from "../../components/FlightResults/FlightResults.jsx";
import FlightFilters from "../../components/FlightFilters/FlightFilters.jsx";
import "./Flights.css";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  const location = useLocation();

  useEffect(() => {
    // Extraer parámetros de búsqueda de la URL
    const urlParams = new URLSearchParams(location.search);
    const params = {
      origin: urlParams.get("origin"),
      destination: urlParams.get("destination"),
      departureDate: urlParams.get("departureDate"),
      returnDate: urlParams.get("returnDate"),
      passengers: urlParams.get("passengers"),
    };
    setSearchParams(params);
  }, [location.search]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/flights");
        if (!response.ok) {
          throw new Error("Error al cargar los vuelos");
        }
        const data = await response.json();
        setFlights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  useEffect(() => {
    // Filtrar vuelos basado en los parámetros de búsqueda
    if (flights.length > 0) {
      let filtered = [...flights];

      // Filtrar por origen
      if (searchParams.origin) {
        const originSearch = searchParams.origin.toLowerCase();
        filtered = filtered.filter(
          (flight) =>
            flight.origin.toLowerCase().includes(originSearch) ||
            originSearch.includes(flight.origin.toLowerCase())
        );
      }

      // Filtrar por destino
      if (searchParams.destination) {
        const destinationSearch = searchParams.destination.toLowerCase();
        filtered = filtered.filter(
          (flight) =>
            flight.destination.toLowerCase().includes(destinationSearch) ||
            destinationSearch.includes(flight.destination.toLowerCase())
        );
      }

      setFilteredFlights(filtered);
    } else {
      setFilteredFlights([]);
    }
  }, [flights, searchParams]);

  const formatTime = (timeString) => {
    if (!timeString) return "00:00";
    return timeString.length === 4 ? `0${timeString}` : timeString;
  };

  const calculateDuration = (departure, arrival) => {
    return "8h 35m";
  };

  const mapFlightData = (flight) => ({
    id: flight.id,
    airline: flight.airline,
    departureTime: formatTime(flight.departureTime),
    arrivalTime: formatTime(flight.arrivalTime),
    departureAirport: flight.origin,
    arrivalAirport: flight.destination,
    duration: calculateDuration(flight.departureTime, flight.arrivalTime),
    returnDepartureTime: formatTime(flight.departureTime),
    returnArrivalTime: formatTime(flight.arrivalTime),
    returnDepartureAirport: flight.destination,
    returnArrivalAirport: flight.origin,
    returnDuration: calculateDuration(flight.departureTime, flight.arrivalTime),
    price: flight.basePrice.toLocaleString(),
  });

  if (loading) return <div className="loading">Cargando vuelos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Usar vuelos filtrados si hay parámetros de búsqueda, sino mostrar todos
  const displayFlights = Object.values(searchParams).some((param) => param)
    ? filteredFlights
    : flights;

  // Generar título dinámico
  const getTitle = () => {
    if (searchParams.origin && searchParams.destination) {
      const originName = searchParams.origin.split(" (")[0];
      const destinationName = searchParams.destination.split(" (")[0];
      return `Vuelos de ${originName} a ${destinationName}`;
    }
    return "Vuelos";
  };

  // Generar información de búsqueda
  const getSearchInfo = () => {
    const info = [];
    if (searchParams.departureDate) {
      info.push(
        `Salida: ${new Date(
          `${searchParams.departureDate}T00:00:00-03:00`
        ).toLocaleDateString("es-ES")}`
      );
    }
    if (searchParams.returnDate) {
      info.push(
        `Regreso: ${new Date(
          `${searchParams.returnDate}T00:00:00-03:00`
        ).toLocaleDateString("es-ES")}`
      );
    }
    if (searchParams.passengers) {
      info.push(`Pasajeros: ${searchParams.passengers}`);
    }
    return info.join(" | ");
  };

  return (
    <div className="flights-container">
      <main className="main-content">
        <SearchBar buttonText="Actualizar búsqueda" />

        <div className="flights-results-container">
          <div className="flights-header">
            <h2 className="flights-title">{getTitle()}</h2>
            {getSearchInfo() && (
              <div className="search-info">{getSearchInfo()}</div>
            )}
            <div className="flights-sort">
              <span className="sort-label">Ordenar por</span>
              <div className="sort-dropdown">
                <span>Mayor precio</span>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>

          <div className="flights-content">
            <FlightFilters />
            <div className="flights-list">
              {displayFlights.length > 0
                ? displayFlights.map((flight) => (
                    <FlightResults
                      key={flight.id}
                      flight={mapFlightData(flight)}
                    />
                  ))
                : Object.values(searchParams).some((param) => param) && (
                    <div className="no-flights">
                      <p>
                        No se encontraron vuelos que coincidan con tu búsqueda.
                      </p>
                      <p>Intenta modificar los criterios de búsqueda.</p>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flights;
