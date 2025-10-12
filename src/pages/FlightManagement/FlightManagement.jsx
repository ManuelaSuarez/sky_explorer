import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaExchangeAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaBuilding,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FlightManagement.css";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const FlightManagement = () => {
  // Estados principales
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [airlineName, setAirlineName] = useState("");
  const [airlines, setAirlines] = useState([]);

  // Estado para el formulario
  const [newFlight, setNewFlight] = useState({
    airline: "",
    origin: "Buenos Aires (BUE)",
    destination: "Catamarca (CTC)",
    date: new Date(),
    capacity: "150",
    basePrice: "85000",
    departureTime: "08:30",
    arrivalTime: "10:15",
  });

  // Lista de aeropuertos para el select
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

  // Obtener datos de la aerolínea o del admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setAirlineName(decodedToken.name);

        if (decodedToken.role === "airline") {
          setNewFlight((prev) => ({ ...prev, airline: decodedToken.name }));
        }
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }

    // carga los vuelos desde el backend
    fetchFlights();
  }, []);

  // Cargar nombres de aerolíneas disponibles si el user es admin
  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/airlines", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener aerolíneas");
        const data = await res.json();
        setAirlines(data);
      } catch (error) {
        console.error("Error cargando aerolíneas:", error);
      }
    };

    // si es admin trae todos los nombres disponibles de aerolíneas
    if (userRole === "admin") {
      fetchAirlines();
    }
  }, [userRole]);

  // Cargar vuelos
  const fetchFlights = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/flights", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (response.ok) {
        const data = await response.json();
        setFlights(data);
      } else {
        throw new Error("Error al cargar vuelos");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar vuelos");
    } finally {
      setLoading(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setNewFlight({
      airline: userRole === "airline" ? airlineName : "",
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

  // Validación y armado del objeto vuelo
  const validateForm = () => {
    const required = [
      "airline",
      "origin",
      "destination",
      "date",
      "departureTime",
      "arrivalTime",
      "capacity",
      "basePrice",
    ];

    const allFieldsFilled = required.every((field) => newFlight[field]);

    if (!allFieldsFilled) return false;

    // Validar que origen y destino no sean iguales
    if (newFlight.origin === newFlight.destination) {
      toast.warning("El origen y el destino no pueden ser iguales");
      return false;
    }

    return true;
  };

  // Preparar datos del vuelo
  const prepareFlightData = () => ({
    airline: newFlight.airline,
    origin: newFlight.origin,
    destination: newFlight.destination,
    date: newFlight.date.toISOString().split("T")[0],
    departureTime: newFlight.departureTime,
    arrivalTime: newFlight.arrivalTime,
    capacity: parseInt(newFlight.capacity),
    basePrice: parseFloat(newFlight.basePrice),
  });

  // Crear vuelo
  const handleCreateFlight = async () => {
    if (!validateForm()) {
      toast.warning("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prepareFlightData()),
      });

      if (response.ok) {
        toast.success("Vuelo creado con éxito");
        resetForm();
        fetchFlights();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el vuelo");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al crear el vuelo");
    }
  };

  // Carga los datos del vuelo para editarlo
  const handleEdit = (id) => {
    const flightToEdit = flights.find((flight) => flight.id === id);
    if (!flightToEdit) {
      toast.error("No se encontró el vuelo seleccionado");
      return;
    }

    setNewFlight({
      airline: flightToEdit.airline || "",
      origin: flightToEdit.origin || "",
      destination: flightToEdit.destination || "",
      date: new Date(flightToEdit.date) || new Date(),
      capacity: flightToEdit.capacity?.toString() || "",
      basePrice: flightToEdit.basePrice?.toString() || "",
      departureTime: flightToEdit.departureTime || "",
      arrivalTime: flightToEdit.arrivalTime || "",
    });

    setEditMode(true);
    setSelectedFlightId(id);
    document
      .querySelector(".create-flight-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Actualiza el vuelo
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      toast.warning("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/flights/${selectedFlightId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(prepareFlightData()),
        }
      );

      if (response.ok) {
        toast.success("Vuelo actualizado con éxito");
        resetForm();
        fetchFlights();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el vuelo");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al actualizar el vuelo");
    }
  };

  // Eliminar vuelo
  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este vuelo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/flights/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Vuelo eliminado con éxito");
        fetchFlights();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el vuelo");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al eliminar el vuelo");
    }
  };

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja fechas del calendario
  const handleDateChange = (date) => {
    setNewFlight((prev) => ({ ...prev, date }));
  };

  // Intercambia el origen por el destino
  const handleExchangeLocations = () => {
    setNewFlight((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  return (
    <div className="flight-management-container">
      <div className="management-content">
        <h1 className="management-title">Panel de Gestión de Vuelos</h1>

        {/* Tabla de vuelos */}
        <div className="flights-table-container">
          <div className="table-with-scrollbar">
            <table className="flights-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Empresa</th>
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
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      Cargando vuelos...
                    </td>
                  </tr>
                ) : flights.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No hay vuelos disponibles
                    </td>
                  </tr>
                ) : (
                  // Filtra solo los vuelos propios si es airline, si es admin muestra todos
                  flights
                    .filter(
                      (flight) =>
                        userRole === "admin" || flight.airline === airlineName
                    )
                    .map((flight) => (
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
                          {flight.status === "Activo" && (
                            <button
                              className="edit-button"
                              onClick={() => handleEdit(flight.id)}
                            >
                              Editar
                            </button>
                          )}
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

        {/* Formulario */}
        <div className="create-flight-section">
          <h2 className="create-flight-title">
            {editMode ? "Editar vuelo" : "Crear un vuelo"}
          </h2>

          <div className="create-flight-form-container">
            <div className="create-flight-form">
              {/* Primera fila */}
              <div className="form-row first-row">
                <div className="form-group">
                  <label>Nombre Empresa*</label>
                  <div className="input-with-icon">
                    <FaBuilding className="input-icon" />

                    {userRole === "admin" ? (
                      <select
                        name="airline"
                        value={newFlight.airline}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione una aerolínea</option>
                        {airlines.map((airline) => (
                          <option key={airline.id} value={airline.name}>
                            {airline.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      // sino, es un input no modificable con con nombre de la aerolínea
                      <input
                        type="text"
                        name="airline"
                        value={newFlight.airline}
                        readOnly
                        disabled
                        style={{
                          backgroundColor: "#f0f0f0",
                          cursor: "not-allowed",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="form-group origin-group">
                  <label>Origen*</label>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt className="field-icon" />
                    <select
                      name="origin"
                      value={newFlight.origin}
                      onChange={handleInputChange}
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
                      name="destination"
                      value={newFlight.destination}
                      onChange={handleInputChange}
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

              {/* Botones */}
              <div className="create-button-container">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={resetForm}
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
