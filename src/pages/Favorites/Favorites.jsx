import { useEffect, useState, useCallback } from "react";
import FlightResults from "../../components/FlightResults/FlightResults";
import "./Favorites.css";

const API = "http://localhost:3000/api/favorites";

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchFavorites = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Debes iniciar sesión para ver tus favoritos");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Favoritos recibidos:", data);
        setFavs(data);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al cargar favoritos");
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Función para preparar los datos del vuelo para FlightResults
  const prepareFlightData = (flight) => {
    console.log("Preparando vuelo:", flight); // Debug
    
    return {
      id: flight.id,
      airline: flight.airline,
      departureTime: flight.departureTime || "08:30",
      arrivalTime: flight.arrivalTime || "10:15", 
      departureAirport: flight.origin,
      arrivalAirport: flight.destination,
      duration: flight.duration || "—", // Ahora viene del backend
      returnDepartureTime: flight.arrivalTime || "10:15",
      returnArrivalTime: flight.departureTime || "08:30",
      returnDepartureAirport: flight.destination,
      returnArrivalAirport: flight.origin,
      returnDuration: flight.returnDuration || flight.duration || "—",
      price: flight.basePrice?.toLocaleString() || "0",
      originalPrice: flight.basePrice || 0,
    };
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">Cargando favoritos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!favs.length) {
    return (
      <div className="favorites-container">
        <div className="favorites-empty">
          <h2>Tus vuelos favoritos</h2>
          <p>Aún no guardaste ningún vuelo.</p>
          <p>Ve a la página de vuelos y haz clic en el corazón para guardar tus favoritos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Tus vuelos favoritos</h2>
        <p>{favs.length} vuelo{favs.length !== 1 ? 's' : ''} guardado{favs.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="favorites-grid">
        {favs.map((flight) => (
          <FlightResults
            key={flight.id}
            flight={prepareFlightData(flight)}
            passengers={1}
          />
        ))}
      </div>
    </div>
  );
}