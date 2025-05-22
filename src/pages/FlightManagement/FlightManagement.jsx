"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaExchangeAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaBuilding,
  FaLock,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FlightManagement.css";

const FlightManagement = () => {
  const navigate = useNavigate();

  // Estado para los vuelos existentes
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // Cambiado a true por defecto para evitar redirecciones inmediatas
  const [error, setError] = useState(null);

  // Estado para el formulario de creación de vuelo
  const [newFlight, setNewFlight] = useState({
    airline: "Aerolineas Argentina",
    origin: "Buenos Aires (BUE)",
    destination: "Catamarca (CTC)",
    date: new Date(),
    capacity: "150",
    basePrice: "85000",
    departureTime: "08:30",
    arrivalTime: "10:15",
  });

  // Verificar si el usuario está autenticado y es administrador
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No hay token disponible");
          setIsAuthorized(false);
          setUserRole(null);
          navigate("/");
          return;
        }

        // Verificar el token con el backend
        const response = await fetch("http://localhost:3000/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token inválido o expirado");
        }

        const userData = await response.json();

        if (userData.role === "admin") {
          setIsAuthorized(true);
          setUserRole("admin");
        } else {
          setIsAuthorized(false);
          setUserRole(userData.role);
          navigate("/");
        }
      } catch (error) {
        console.error("Error al verificar el rol del usuario:", error);
        setIsAuthorized(false);
        // Mostrar mensaje de error pero no redirigir automáticamente
        setError(
          "No tienes permisos para acceder a esta página. Esta sección está reservada para administradores."
        );
      }
    };

    checkUserRole();
  }, [navigate]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight({
      ...newFlight,
      [name]: value,
    });
  };

  // Manejar cambio de fecha
  const handleDateChange = (date) => {
    setNewFlight({
      ...newFlight,
      date: date,
    });
  };

  // Manejar intercambio de origen y destino
  const handleExchangeLocations = () => {
    setNewFlight({
      ...newFlight,
      origin: newFlight.destination,
      destination: newFlight.origin,
    });
  };

  // Función para cargar los vuelos
  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      // Realizar la petición al backend
      const response = await fetch("http://localhost:3000/api/flights");

      if (!response.ok) {
        throw new Error(
          `Error al cargar los vuelos: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error("Error:", error);
      setError(`Error al cargar los vuelos: ${error.message}`);

      // Intentamos cargar desde localStorage como fallback
      const savedFlights = localStorage.getItem("flights");
      if (savedFlights) {
        setFlights(JSON.parse(savedFlights));
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar los vuelos al montar el componente
  useEffect(() => {
    if (isAuthorized) {
      fetchFlights();
    }
  }, [isAuthorized]);

  // Crear nuevo vuelo
  const handleCreateFlight = async () => {
    // Validar campos requeridos
    if (
      !newFlight.airline ||
      !newFlight.origin ||
      !newFlight.destination ||
      !newFlight.date ||
      !newFlight.departureTime ||
      !newFlight.arrivalTime ||
      !newFlight.capacity ||
      !newFlight.basePrice
    ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión como administrador");
        navigate("/");
        return;
      }

      const flightData = {
        airline: newFlight.airline,
        origin: newFlight.origin,
        destination: newFlight.destination,
        date: newFlight.date.toISOString().split("T")[0],
        departureTime: newFlight.departureTime,
        arrivalTime: newFlight.arrivalTime,
        capacity: Number.parseInt(newFlight.capacity),
        basePrice: Number.parseFloat(newFlight.basePrice),
      };

      const response = await fetch("http://localhost:3000/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(flightData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Error al crear el vuelo");
      }

      // Vuelo creado exitosamente
      alert("Vuelo creado con éxito");

      // Limpiar el formulario
      setNewFlight({
        airline: "Aerolineas Argentina",
        origin: "Buenos Aires (BUE)",
        destination: "Catamarca (CTC)",
        date: new Date(),
        capacity: "150",
        basePrice: "85000",
        departureTime: "08:30",
        arrivalTime: "10:15",
      });

      // Actualizar la lista de vuelos
      setFlights([responseData, ...flights]);
    } catch (error) {
      console.error("Error:", error);
      setError(`Error al crear el vuelo: ${error.message}`);
      alert(error.message || "Error al crear el vuelo");
    }
  };

  // Editar vuelo
  const handleEdit = async (id) => {
    // Buscar el vuelo seleccionado
    const flightToEdit = flights.find((flight) => flight.id === id);

    if (!flightToEdit) {
      alert("No se encontró el vuelo seleccionado");
      return;
    }

    // Formatear la fecha correctamente
    let flightDate = new Date();
    try {
      // Intentar convertir la fecha del vuelo a un objeto Date
      flightDate = flightToEdit.date ? new Date(flightToEdit.date) : new Date();
    } catch (error) {
      console.error("Error al convertir la fecha:", error);
    }

    // Cargar los datos del vuelo en el formulario
    setNewFlight({
      airline: flightToEdit.airline || "",
      origin: flightToEdit.origin || "",
      destination: flightToEdit.destination || "",
      date: flightDate,
      capacity: flightToEdit.capacity?.toString() || "",
      basePrice: flightToEdit.basePrice?.toString() || "",
      departureTime: flightToEdit.departureTime || "",
      arrivalTime: flightToEdit.arrivalTime || "",
    });

    // Activar el modo de edición y guardar el ID del vuelo
    setEditMode(true);
    setSelectedFlightId(id);

    // Hacer scroll hasta el formulario
    document
      .querySelector(".create-flight-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Guardar cambios de un vuelo
  const handleSaveChanges = async () => {
    // Validar campos requeridos
    if (
      !newFlight.airline ||
      !newFlight.origin ||
      !newFlight.destination ||
      !newFlight.date ||
      !newFlight.departureTime ||
      !newFlight.arrivalTime ||
      !newFlight.capacity ||
      !newFlight.basePrice
    ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión como administrador");
        navigate("/");
        return;
      }

      const flightData = {
        airline: newFlight.airline,
        origin: newFlight.origin,
        destination: newFlight.destination,
        date: newFlight.date.toISOString().split("T")[0],
        departureTime: newFlight.departureTime,
        arrivalTime: newFlight.arrivalTime,
        capacity: Number.parseInt(newFlight.capacity),
        basePrice: Number.parseFloat(newFlight.basePrice),
      };

      const response = await fetch(
        `http://localhost:3000/api/flights/${selectedFlightId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(flightData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Error al actualizar el vuelo");
      }

      // Vuelo actualizado exitosamente
      alert("Vuelo actualizado con éxito");

      // Actualizar la lista de vuelos
      setFlights(
        flights.map((flight) =>
          flight.id === selectedFlightId ? responseData : flight
        )
      );

      // Limpiar el formulario y salir del modo edición
      setNewFlight({
        airline: "Aerolineas Argentina",
        origin: "Buenos Aires (BUE)",
        destination: "Catamarca (CTC)",
        date: new Date(),
        capacity: "150",
        basePrice: "85000",
        departureTime: "08:30",
        arrivalTime: "10:15",
      });
      setEditMode(false);
      setSelectedFlightId(null);
    } catch (error) {
      console.error("Error:", error);
      setError(`Error al actualizar el vuelo: ${error.message}`);
      alert(error.message || "Error al actualizar el vuelo");
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    // Limpiar el formulario y salir del modo edición
    setNewFlight({
      airline: "Aerolineas Argentina",
      origin: "Buenos Aires (BUE)",
      destination: "Catamarca (CTC)",
      date: new Date(),
      capacity: "150",
      basePrice: "85000",
      departureTime: "08:30",
      arrivalTime: "10:15",
    });
    setEditMode(false);
    setSelectedFlightId(null);
  };

  // Eliminar vuelo
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este vuelo?")) {
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Debes iniciar sesión como administrador");
          navigate("/");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/flights/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Error al eliminar el vuelo");
        }

        // Vuelo eliminado exitosamente
        alert("Vuelo eliminado con éxito");

        // Actualizar la lista de vuelos
        setFlights(flights.filter((flight) => flight.id !== id));
      } catch (error) {
        console.error("Error:", error);
        setError(`Error al eliminar el vuelo: ${error.message}`);
        alert(error.message || "Error al eliminar el vuelo");
      }
    }
  };

  // Si el usuario no está autorizado, mostrar mensaje de acceso denegado
  if (!isAuthorized) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-content">
          <FaLock className="access-denied-icon" />
          <h2>Acceso Denegado</h2>
          <p>{error || "No tienes permisos para acceder a esta página."}</p>
          <p>Esta sección está reservada para administradores.</p>
          <button className="back-button" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-management-container">
      <div className="management-content">
        <h1 className="management-title">Panel de Gestión de Vuelos</h1>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Tabla de vuelos existentes */}
        <div className="flights-table-container">
          <div className="table-with-scrollbar">
            <table className="flights-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Empresa</th>
                  <th>Fecha de compra</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Fecha</th>
                  <th>Horario de salida</th>
                  <th>Horario de llegada</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                  <th>Cancelar</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      Cargando vuelos...
                    </td>
                  </tr>
                ) : flights.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      No hay vuelos disponibles
                    </td>
                  </tr>
                ) : (
                  flights.map((flight) => (
                    <tr
                      key={flight.id}
                      className={
                        flight.status === "Activo"
                          ? "active-row"
                          : "inactive-row"
                      }
                    >
                      <td>{flight.id}</td>
                      <td>{flight.airline}</td>
                      <td>{flight.purchaseDate}</td>
                      <td>{flight.origin}</td>
                      <td>{flight.destination}</td>
                      <td>{flight.date}</td>
                      <td>{flight.departureTime}</td>
                      <td>{flight.arrivalTime}</td>
                      <td
                        className={
                          flight.status === "Activo"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {flight.status}
                      </td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(flight.id)}
                        >
                          Editar
                        </button>
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(flight.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario para crear nuevo vuelo */}
        <div className="create-flight-section">
          <h2 className="create-flight-title">
            {editMode ? "Editar vuelo" : "Crear un vuelo"}
          </h2>

          <div className="create-flight-form-container">
            <div className="create-flight-form">
              {/* Primera fila - todos los inputs al mismo nivel */}
              <div className="form-row first-row">
                <div className="form-group">
                  <label>Nombre Empresa*</label>
                  <div className="input-with-icon">
                    <FaBuilding className="input-icon" />
                    <input
                      type="text"
                      name="airline"
                      value={newFlight.airline}
                      onChange={handleInputChange}
                      placeholder="Nombre de la aerolínea"
                    />
                  </div>
                </div>

                <div className="form-group origin-group">
                  <label>Origen*</label>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      type="text"
                      name="origin"
                      value={newFlight.origin}
                      onChange={handleInputChange}
                      placeholder="Ciudad de origen"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="exchange-button"
                  onClick={handleExchangeLocations}
                >
                  <FaExchangeAlt />
                </button>

                <div className="form-group destination-group">
                  <label>Destino*</label>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      type="text"
                      name="destination"
                      value={newFlight.destination}
                      onChange={handleInputChange}
                      placeholder="Ciudad de destino"
                    />
                  </div>
                </div>

                <div className="form-group date-group">
                  <label>Fecha de salida*</label>
                  <div className="input-with-icon date-picker-container">
                    <FaCalendarAlt className="input-icon" />
                    <DatePicker
                      selected={newFlight.date}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      className="date-picker"
                    />
                  </div>
                </div>
              </div>

              {/* Segunda fila */}
              <div className="form-row second-row">
                <div className="form-group">
                  <label>Capacidad total*</label>
                  <div className="input-with-icon">
                    <FaUsers className="input-icon" />
                    <input
                      type="number"
                      name="capacity"
                      value={newFlight.capacity}
                      onChange={handleInputChange}
                      placeholder="Número de pasajeros"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Precio base*</label>
                  <div className="input-with-icon">
                    <FaDollarSign className="input-icon" />
                    <input
                      type="number"
                      name="basePrice"
                      value={newFlight.basePrice}
                      onChange={handleInputChange}
                      placeholder="Precio en pesos"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Horario de salida*</label>
                  <div className="input-with-icon time-picker-container">
                    <FaClock className="input-icon" />
                    <input
                      type="time"
                      name="departureTime"
                      value={newFlight.departureTime}
                      onChange={handleInputChange}
                      className="time-picker"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Horario de llegada*</label>
                  <div className="input-with-icon time-picker-container">
                    <FaClock className="input-icon" />
                    <input
                      type="time"
                      name="arrivalTime"
                      value={newFlight.arrivalTime}
                      onChange={handleInputChange}
                      className="time-picker"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="create-button-container">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="create-button"
                      onClick={handleSaveChanges}
                    >
                      Guardar cambios
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="create-button"
                    onClick={handleCreateFlight}
                  >
                    Crear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightManagement;
