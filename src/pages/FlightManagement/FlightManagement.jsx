import { useState, useEffect } from "react"
import {
  FaTrash,
  FaExchangeAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaBuilding,
} from "react-icons/fa"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./FlightManagement.css"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { showConfirmToast } from "../../utils/toasts/confirmToast"

const FlightManagement = () => {
  // Estados principales
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedFlightId, setSelectedFlightId] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [airlineName, setAirlineName] = useState("")
  const [airlines, setAirlines] = useState([])

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
    image: null,
    isFeatured: false,
  })

  // Lista de aeropuertos
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
  ]

  const isFlightInactive = (date) => {
    const today = new Date()
    const flightDate = new Date(date)
    return flightDate < today
  }

  // Cargar datos al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUserRole(decodedToken.role)
      setAirlineName(decodedToken.name)

      if (decodedToken.role === "airline") {
        setNewFlight((prev) => ({ ...prev, airline: decodedToken.name }))
      }
    }
    fetchFlights()
  }, [])

  // Cargar aerolíneas si es admin
  useEffect(() => {
    if (userRole === "admin") {
      fetch("http://localhost:3000/api/airlines", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setAirlines(data))
        .catch((err) => console.error("Error:", err))
    }
  }, [userRole])

  // Cargar vuelos (TODOS para administración)
  const fetchFlights = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/flights/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setFlights(data)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al cargar vuelos")
    } finally {
      setLoading(false)
    }
  }

  // Resetear formulario
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
      image: null,
      isFeatured: false,
    })
    setEditMode(false)
    setSelectedFlightId(null)
  }

  // Validar formulario
  const validateForm = () => {
    if (!newFlight.airline || !newFlight.origin || !newFlight.destination) {
      toast.warning("Por favor complete todos los campos obligatorios")
      return false
    }

    if (newFlight.origin === newFlight.destination) {
      toast.warning("El origen y el destino no pueden ser iguales")
      return false
    }

    // Validar imagen si es destacado
    if (newFlight.isFeatured) {
      // Si es nuevo vuelo: imagen es obligatoria
      if (!editMode && !newFlight.image) {
        toast.warning("La imagen es obligatoria para vuelos destacados")
        return false
      }

      // Si estamos editando: validar que tenga imagen
      if (editMode && !newFlight.image) {
        const flight = flights.find((f) => f.id === selectedFlightId)
        if (!flight.imageUrl) {
          toast.warning("La imagen es obligatoria para vuelos destacados")
          return false
        }
      }
    }

    return true
  }

  // Crear vuelo
  const handleCreateFlight = async () => {
    if (!validateForm()) {
      toast.warning("Por favor complete todos los campos obligatorios")
      return
    }

    showConfirmToast("¿Deseas crear este nuevo vuelo?", async () => {
      const formData = new FormData()
      formData.append("airline", newFlight.airline)
      formData.append("origin", newFlight.origin)
      formData.append("destination", newFlight.destination)
      formData.append("date", newFlight.date.toISOString().split("T")[0])
      formData.append("departureTime", newFlight.departureTime)
      formData.append("arrivalTime", newFlight.arrivalTime)
      formData.append("capacity", newFlight.capacity)
      formData.append("basePrice", newFlight.basePrice)
      formData.append("isFeatured", isFlightInactive(newFlight.date) ? false : newFlight.isFeatured)

      if (newFlight.image) {
        formData.append("image", newFlight.image)
      }

      try {
        const response = await fetch("http://localhost:3000/api/flights", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        })

        if (response.ok) {
          toast.success("Vuelo creado con éxito")
          resetForm()
          fetchFlights()
        } else {
          toast.error("Error al crear el vuelo")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al crear el vuelo")
      }
    })
  }

  // Editar vuelo
  const handleEdit = (id) => {
    const flightToEdit = flights.find((flight) => flight.id === id)
    if (!flightToEdit) {
      toast.error("No se encontró el vuelo seleccionado")
      return
    }

    setNewFlight({
      airline: flightToEdit.airline,
      origin: flightToEdit.origin,
      destination: flightToEdit.destination,
      date: new Date(flightToEdit.date),
      capacity: flightToEdit.capacity.toString(),
      basePrice: flightToEdit.basePrice.toString(),
      departureTime: flightToEdit.departureTime,
      arrivalTime: flightToEdit.arrivalTime,
      image: null,
      isFeatured: isFlightInactive(flightToEdit.date) ? false : flightToEdit.isFeatured || false
    })

    setEditMode(true)
    setSelectedFlightId(id)
  }

  // Actualizar vuelo
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      toast.warning("Por favor complete todos los campos obligatorios")
      return
    }

    showConfirmToast("¿Deseas guardar los cambios de este vuelo?", async () => {
      const formData = new FormData()
      formData.append("airline", newFlight.airline)
      formData.append("origin", newFlight.origin)
      formData.append("destination", newFlight.destination)
      formData.append("date", newFlight.date.toISOString().split("T")[0])
      formData.append("departureTime", newFlight.departureTime)
      formData.append("arrivalTime", newFlight.arrivalTime)
      formData.append("capacity", newFlight.capacity)
      formData.append("basePrice", newFlight.basePrice)
      formData.append("isFeatured", isFlightInactive(newFlight.date) ? false : newFlight.isFeatured)

      if (newFlight.image) {
        formData.append("image", newFlight.image)
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/flights/${selectedFlightId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        )

        if (response.ok) {
          toast.success("Vuelo actualizado con éxito")
          resetForm()
          fetchFlights()
        } else {
          toast.error("Error al actualizar el vuelo")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar el vuelo")
      }
    })
  }

  // Eliminar vuelo
  const handleDelete = async (id) => {
    showConfirmToast("¿Está seguro que desea eliminar este vuelo?", async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/flights/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          toast.success("Vuelo eliminado con éxito")
          fetchFlights()
        } else {
          toast.error("Error al eliminar el vuelo")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al eliminar el vuelo")
      }
    })
  }

  // Cambiar campo del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewFlight((prev) => ({ ...prev, [name]: value }))
  }

  // Cambiar fecha
  const handleDateChange = (date) => {
    setNewFlight((prev) => ({ ...prev, date }))
  }

  // Intercambiar origen y destino
  const handleExchangeLocations = () => {
    setNewFlight((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }))
  }

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
                  flights
                    .filter(
                      (flight) =>
                        userRole === "admin" || flight.airline === airlineName
                    )
                    .map((flight) => (
                      <tr
                        key={flight.id}
                        className={
                          isFlightInactive(flight.date)
                            ? "inactive-row"
                            : flight.status === "Activo"
                              ? "active-row"
                              : ""
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
                            isFlightInactive(flight.date)
                              ? "status-inactive"
                              : flight.status === "Activo"
                                ? "status-active"
                                : ""
                          }
                        >
                          {flight.status}
                        </td>
                        <td>
                          {flight.status === "Activo" && (
                            <button className="edit-button" onClick={() => handleEdit(flight.id)}>
                              Editar
                            </button>
                          )}
                        </td>
                        <td>
                          <button className="delete-button" onClick={() => handleDelete(flight.id)}>
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
                      <input
                        className="input-disabled"
                        type="text"
                        name="airline"
                        value={newFlight.airline}
                        readOnly
                        disabled
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

              {/* Tercera fila: Imagen y destacado */}
              <div className="form-row third-row">
                <div className="form-group image-group">
                  <label>
                    Imagen del vuelo
                    {newFlight.isFeatured && (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </label>
                  <div className="image-input-container">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) =>
                        setNewFlight({ ...newFlight, image: e.target.files[0] })
                      }
                      id="image-input"
                    />
                    {newFlight.image && (
                      <button
                        type="button"
                        className="delete-image-button"
                        onClick={() =>
                          setNewFlight({ ...newFlight, image: null })
                        }
                        title="Eliminar imagen"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {newFlight.image && (
                    <small className="image-selected">
                      ✓ {newFlight.image.name}
                    </small>
                  )}
                  {newFlight.isFeatured && !newFlight.image && (
                    <small style={{ color: "orange", marginTop: "4px" }}>
                      Obligatoria para vuelos destacados
                    </small>
                  )}
                </div>

                <div className="featured-group">
                  <label htmlFor="featured-checkbox" className="featured-label">
                    <input
                      type="checkbox"
                      id="featured-checkbox"
                      checked={newFlight.isFeatured}
                      disabled={isFlightInactive(newFlight.date)}
                      onChange={(e) =>
                        setNewFlight({
                          ...newFlight,
                          isFeatured: e.target.checked,
                        })
                      }
                    />
                    <span>Destacado</span>
                  </label>
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
  )
}

export default FlightManagement
