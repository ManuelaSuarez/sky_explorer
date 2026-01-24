import React, { useState, useEffect } from "react";
import "./FlightPanel.css";
import { useNavigate } from "react-router-dom";

const FlightPanel = ({ setModalVisible }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");

  const fetchUserBookings = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No estás autenticado. Por favor, inicia sesión.");

      const response = await fetch("http://localhost:3000/api/bookings/my-bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        throw new Error("Error al cargar las reservas");
      }

      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      setError(error.message);
      if (error.message.includes("autenticado") || error.message.includes("Sesión expirada")) {
        if (setModalVisible) setModalVisible("login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Construcción local de fecha/hora
  const buildLocalDateTime = (flight) => {
    const [year, month, day] = flight.date.split("-").map(Number);
    const [hour, minute] = flight.departureTime.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  const formatDate = (flight) => {
    const localDate = buildLocalDateTime(flight);
    return localDate.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFlightStatus = (booking) => {
    const today = new Date();
    const flightDate = buildLocalDateTime(booking.flight);
    return flightDate < today ? "Inactivo" : "Activo";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Activo": return "status-active";
      case "Inactivo": return "status-inactive";
      default: return "status-default";
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      if (setModalVisible) setModalVisible("login");
    } else {
      fetchUserBookings();
    }
  }, [setModalVisible]);

  if (loading) {
    return <div className="flightPanel-container"><div className="loading-message">Cargando tus vuelos...</div></div>;
  }

  if (error) {
    return (
      <div className="flightPanel-container">
        <div className="error-message">
          {error}
          <button onClick={fetchUserBookings} className="retry-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flightPanel-container">
      <div className="panel-header">
        <h2>Mis Vuelos Reservados</h2>
        <button onClick={fetchUserBookings} className="refresh-button">Actualizar</button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No tienes vuelos reservados aún.</p>
          <p>¡Encuentra tu próximo destino!</p>
          <button onClick={() => navigate("/")} className="search-flights-button">Buscar Vuelos</button>
        </div>
      ) : (
        <table className="flightPanel-table">
          <thead>
            <tr>
              <th>Fecha de Compra</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha de Salida</th>
              <th>Hora de Salida</th>
              <th>Hora de Llegada</th>
              <th>Pasajeros</th>
              <th>Total Pagado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const status = getFlightStatus(booking);
              return (
                <tr key={booking.id}>
                  <td>{new Date(booking.purchaseDate).toLocaleDateString("es-AR")}</td>
                  <td>{booking.flight?.departureAirport || booking.flight?.origin}</td>
                  <td>{booking.flight?.arrivalAirport || booking.flight?.destination}</td>
                  <td>{formatDate(booking.flight)}</td>
                  <td>{booking.flight?.departureTime}</td>
                  <td>{booking.flight?.arrivalTime}</td>
                  <td>{booking.passengerCount}</td>
                  <td className="price">${parseFloat(booking.totalPrice).toLocaleString()}</td>
                  <td><span className={`status ${getStatusClass(status)}`}>{status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FlightPanel;
