import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FlightResults from "../../components/FlightResults/FlightResults";
import "./Favorites.css";

const API = "http://localhost:3000/api/favorites";

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFavs(data);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al cargar favoritos");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const prepareFlightData = (flight) => {
    const fechaSalida = flight.date;

    return {
      id: flight.id,
      airline: flight.airline,
      departureTime: flight.departureTime || "08:30",
      arrivalTime: flight.arrivalTime || "10:15",
      departureAirport: flight.origin,
      arrivalAirport: flight.destination,
      duration: flight.duration || "—",
      returnDepartureTime: flight.arrivalTime || "10:15",
      returnArrivalTime: flight.departureTime || "08:30",
      returnDepartureAirport: flight.destination,
      returnArrivalAirport: flight.origin,
      returnDuration: flight.returnDuration || flight.duration || "—",
      price: flight.basePrice.toLocaleString(),
      originalPrice: flight.basePrice,
      date: fechaSalida,
    };
  };

  // volver a Flights con búsqueda cargada
 const handleGoToFlights = (flight) => {
  const fechaSalida = new Date(flight.date + "T00:00:00");
  const fechaRegreso = new Date(fechaSalida);
  fechaRegreso.setDate(fechaSalida.getDate() + 7);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  navigate(
    `/flights?origin=${flight.origin}` +
    `&destination=${flight.destination}` +
    `&departureDate=${formatDate(fechaSalida)}` +
    `&returnDate=${formatDate(fechaRegreso)}` +
    `&passengers=1`
  );
};

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Tus vuelos favoritos</h2>
        <p>
          {favs.length} vuelo{favs.length !== 1 && "s"} guardado
          {favs.length !== 1 && "s"}
        </p>
      </div>

      <div className="favorites-grid">
        {favs.map((flight) => {
          const preparedFlight = prepareFlightData(flight);

          return (
            <FlightResults
              key={flight.id}
              flight={preparedFlight}
              passengers={1}
              departureDate={preparedFlight.date}
              returnDate=""
              onBuy={() => handleGoToFlights(flight)}
            />
          );
        })}
      </div>
    </div>
  );
}
