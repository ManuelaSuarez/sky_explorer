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
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [origin, setOrigin] = useState(""); // Para el select
  const [destination, setDestination] = useState("");

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
          // Quitamos el alert que bloquea
          navigate("/");
          return;
        }

        setIsAuthorized(true);
        setUserRole("admin");
      } catch (error) {
        console.error("Error al verificar el rol del usuario:", error);
        setIsAuthorized(false);
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

  // Habría que ver que función es la que cambia correctamente
  /*const handleExchangeLocations = () => {
    setNewFlight({
      ...newFlight,
      origin: newFlight.destination,
      destination: newFlight.origin,
    });
  };*/

  // Manejar intercambio de origen y destino
  const handleExchangeLocations = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  // Añadir esta función para cargar los vuelos
  const fetchFlights = async () => {
    setLoading(true);
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem("token");

      // Realizar la petición al backend
      const response = await fetch("http://localhost:3000/api/flights", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los vuelos");
      }

      const data = await response.json();
      setFlights(data);

      // También guardamos en localStorage como respaldo
      localStorage.setItem("flights", JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);

      // Si falla la conexión, intentamos cargar desde localStorage como fallback
      const savedFlights = localStorage.getItem("flights");
      if (savedFlights) {
        setFlights(JSON.parse(savedFlights));
      }
    } finally {
      setLoading(false);
    }
  };

  // Añadir este useEffect para cargar los vuelos al montar el componente
  useEffect(() => {
    fetchFlights();
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el vuelo");
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

      // Recargar la lista de vuelos
      fetchFlights();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al crear el vuelo");

      // Si falla la conexión, guardamos en localStorage como fallback
      const newId =
        flights.length > 0 ? Math.max(...flights.map((f) => f.id)) + 1 : 1;
      const createdFlight = {
        id: newId,
        ...newFlight,
        date: newFlight.date.toISOString().split("T")[0],
        capacity: Number(newFlight.capacity),
        basePrice: Number(newFlight.basePrice),
        status: "Activo",
        purchaseDate: new Date().toISOString().split("T")[0],
      };

      const updatedFlights = [createdFlight, ...flights];
      setFlights(updatedFlights);
      localStorage.setItem("flights", JSON.stringify(updatedFlights));
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el vuelo");
      }

      // Vuelo actualizado exitosamente
      alert("Vuelo actualizado con éxito");

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

      // Recargar la lista de vuelos
      fetchFlights();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al actualizar el vuelo");

      // Si falla la conexión, actualizamos en localStorage como fallback
      const updatedFlights = flights.map((flight) => {
        if (flight.id === selectedFlightId) {
          return {
            ...flight,
            ...newFlight,
            date: newFlight.date.toISOString().split("T")[0],
            capacity: Number(newFlight.capacity),
            basePrice: Number(newFlight.basePrice),
          };
        }
        return flight;
      });

      setFlights(updatedFlights);
      localStorage.setItem("flights", JSON.stringify(updatedFlights));
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar el vuelo");
        }

        // Vuelo eliminado exitosamente
        alert("Vuelo eliminado con éxito");

        // Recargar la lista de vuelos
        fetchFlights();
      } catch (error) {
        console.error("Error:", error);
        alert(error.message || "Error al eliminar el vuelo");

        // Si falla la conexión, eliminamos de localStorage como fallback
        const updatedFlights = flights.filter((flight) => flight.id !== id);
        setFlights(updatedFlights);
        localStorage.setItem("flights", JSON.stringify(updatedFlights));
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
          <p>No tienes permisos para acceder a esta página.</p>
          <p>Esta sección está reservada para administradores.</p>
          <button className="back-button" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="flight-management-container">
      <div className="management-content">
        <h1 className="management-title">Panel de Gestión de Vuelos</h1>

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
