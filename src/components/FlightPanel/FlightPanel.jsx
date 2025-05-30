// FlightPanel.jsx - Versión sin código de reserva
import React, { useState, useEffect } from "react";
import "./FlightPanel.css";
import { useNavigate } from "react-router-dom"; // Se conserva useNavigate

// Accept setModalVisible as a prop
const FlightPanel = ({ setModalVisible }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Se conserva la inicialización de useNavigate

  // Función para obtener el token del usuario
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Función para obtener las reservas del usuario autenticado
  const fetchUserBookings = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        // If no token, throw an error to trigger the catch block
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
      }

      // Usar la nueva ruta para obtener las reservas del usuario autenticado
      const response = await fetch("http://localhost:3000/api/bookings/my-bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Incluir el token
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        throw new Error("Error al cargar las reservas");
      }

      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      setError(error.message);

      // If the error is due to authentication, open the login modal
      if (error.message.includes("autenticado") || error.message.includes("Sesión expirada")) {
        if (setModalVisible) { // Ensure setModalVisible is provided as a prop
          setModalVisible("login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para obtener el estado visual del vuelo
  const getFlightStatus = (booking) => {
    const today = new Date();
    const flightDate = new Date(booking.flight.date);

    // Si ya pasó la fecha de salida, es Inactivo
    if (flightDate < today) {
      return 'Inactivo';
    } else {
      return 'Activo';
    }
  };

  // Función para obtener la clase CSS del estado
  const getStatusClass = (status) => {
    switch (status) {
      case 'Activo':
        return 'status-active';
      case 'Inactivo':
        return 'status-inactive';
      default:
        return 'status-default';
    }
  };

  // Cargar las reservas cuando el componente se monta
  useEffect(() => {
    // Check for token on mount and open modal if not present
    const token = getAuthToken();
    if (!token) {
      if (setModalVisible) {
        setModalVisible("login");
      }
    } else {
      fetchUserBookings();
    }
  }, [setModalVisible]); // Add setModalVisible to dependency array

  if (loading) {
    return (
      <div className="flightPanel-container">
        <div className="loading-message">Cargando tus vuelos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flightPanel-container">
        <div className="error-message">
          {error}
          <button onClick={fetchUserBookings} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flightPanel-container">
      <div className="panel-header">
        <h2>Mis Vuelos Reservados</h2>
        <button onClick={fetchUserBookings} className="refresh-button">
          Actualizar
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No tienes vuelos reservados aún.</p>
          <p>¡Encuentra tu próximo destino!</p>
          {/* This button uses useNavigate to go to the home page */}
          <button onClick={() => navigate("/")} className="search-flights-button">
            Buscar Vuelos
          </button>
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
                  <td>{formatDate(booking.purchaseDate)}</td>
                  <td>{booking.flight?.departureAirport || booking.flight?.origin}</td>
                  <td>{booking.flight?.arrivalAirport || booking.flight?.destination}</td>
                  <td>{formatDate(booking.flight?.date)}</td>
                  <td>{booking.flight?.departureTime}</td>
                  <td>{booking.flight?.arrivalTime}</td>
                  <td>{booking.passengerCount}</td>
                  <td className="price">
                    ${parseFloat(booking.totalPrice).toLocaleString()}
                  </td>
                  <td>
                    <span className={`status ${getStatusClass(status)}`}>
                      {status}
                    </span>
                  </td>
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