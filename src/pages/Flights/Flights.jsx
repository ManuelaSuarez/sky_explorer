import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import FlightResults from "../../components/FlightResults/FlightResults";
import FlightFilters from "../../components/FlightFilters/FlightFilters";
import "./Flights.css";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
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

  const formatTime = (timeString) => {
    if (!timeString) return "00:00";
    return timeString.length === 4 ? `0${timeString}` : timeString;
  };

  const calculateDuration = (departure, arrival) => {
    // Implementación simplificada
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

  return (
    <div className="flights-container">
      <main className="main-content">
        <SearchBar buttonText="Actualizar" />

        <div className="flights-results-container">
          <div className="flights-header">
            <h2 className="flights-title">Vuelos</h2>
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
              {flights.map((flight) => (
                <FlightResults key={flight.id} flight={mapFlightData(flight)} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flights;