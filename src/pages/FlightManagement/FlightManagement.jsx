"use client"

import { useState } from "react"
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
import es from 'date-fns/locale/es';

const FlightManagement = () => {
  // Estado para los vuelos existentes
  const [flights, setFlights] = useState([
    {
      id: 1,
      airline: "Aerolineas Arg.",
      purchaseDate: "01/09/2024",
      origin: "Buenos Aires (BUE)",
      destination: "Catamarca (CTC)",
      date: "11/09/2024",
      departureTime: "12:00 Hs",
      arrivalTime: "18:00 Hs",
      status: "Inactivo",
    },
    {
      id: 2,
      airline: "Emirates",
      purchaseDate: "01/09/2024",
      origin: "Catamarca (CTC)",
      destination: "Buenos Aires (BUE)",
      date: "21/09/2024",
      departureTime: "16:00 Hs",
      arrivalTime: "22:00 Hs",
      status: "Activo",
    },
  ])

  // Estado para validación
  const [errors, setErrors] = useState({
    date: "",
    departureTime: "",
    arrivalTime: ""
  })

  // Estado para el formulario de creación de vuelo
  const [newFlight, setNewFlight] = useState({
    airline: "Aerolineas Argentina",
    origin: "Buenos Aires (BUE)",
    destination: "Catamarca (CTC)",
    date: new Date(),
    capacity: "",
    basePrice: "",
    departureTime: "",
    arrivalTime: "",
    file: null,
  })

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewFlight({
      ...newFlight,
      [name]: value,
    })
    
    // Validar horarios cuando cambian
    if (name === "departureTime" || name === "arrivalTime") {
      validateTimes(name, value)
    }
  }

  // Manejar cambio de fecha
  const handleDateChange = (date) => {
    // Validar que la fecha no sea en el pasado
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) {
      setErrors({...errors, date: "La fecha no puede ser en el pasado"})
    } else {
      setErrors({...errors, date: ""})
    }
    
    setNewFlight({
      ...newFlight,
      date: date,
    })
  }

  // Validar horarios
  const validateTimes = (field, value) => {
    // Simplificación de la validación de horarios
    if (field === "departureTime" && newFlight.arrivalTime && value >= newFlight.arrivalTime) {
      setErrors({
        ...errors,
        departureTime: "La hora de salida debe ser anterior a la llegada",
        arrivalTime: ""
      })
    } else if (field === "arrivalTime" && newFlight.departureTime && value <= newFlight.departureTime) {
      setErrors({
        ...errors,
        arrivalTime: "La hora de llegada debe ser posterior a la salida",
        departureTime: ""
      })
    } else {
      // Solo limpia el error del campo actual
      const newErrors = {...errors}
      newErrors[field] = ""
      setErrors(newErrors)
    }
  }

  // Manejar intercambio de origen y destino
  const handleExchangeLocations = () => {
    setNewFlight({
      ...newFlight,
      origin: newFlight.destination,
      destination: newFlight.origin,
    })
  }

  // Crear nuevo vuelo
  const handleCreateFlight = () => {
    // Validar campos requeridos de forma simple
    if (!newFlight.airline) {
      alert("Por favor ingrese el nombre de la aerolínea")
      return
    }
    
    if (!newFlight.origin) {
      alert("Por favor ingrese el origen")
      return
    }
    
    if (!newFlight.destination) {
      alert("Por favor ingrese el destino")
      return
    }
    
    if (!newFlight.capacity) {
      alert("Por favor ingrese la capacidad total")
      return
    }
    
    if (!newFlight.basePrice) {
      alert("Por favor ingrese el precio base")
      return
    }
    
    if (!newFlight.departureTime) {
      alert("Por favor ingrese el horario de salida")
      return
    }
    
    if (!newFlight.arrivalTime) {
      alert("Por favor ingrese el horario de llegada")
      return
    }
    
    // Verificar errores específicos
    if (errors.date) {
      alert("La fecha seleccionada no es válida")
      return
    }
    
    if (errors.departureTime) {
      alert("El horario de salida no es válido")
      return
    }
    
    if (errors.arrivalTime) {
      alert("El horario de llegada no es válido")
      return
    }
    
    // Origen y destino no pueden ser iguales
    if (newFlight.origin === newFlight.destination) {
      alert("El origen y destino no pueden ser iguales")
      return
    }

    // Formatear fecha
    const formattedDate = newFlight.date.toLocaleDateString("es-AR")

    // Crear nuevo vuelo con ID único
    const newFlightWithId = {
      id: flights.length + 1,
      airline: newFlight.airline,
      purchaseDate: new Date().toLocaleDateString("es-AR"),
      origin: newFlight.origin,
      destination: newFlight.destination,
      date: formattedDate,
      departureTime: newFlight.departureTime ? `${newFlight.departureTime} Hs` : "",
      arrivalTime: newFlight.arrivalTime ? `${newFlight.arrivalTime} Hs` : "",
      status: "Activo",
    }

    // Añadir a la lista de vuelos
    setFlights([...flights, newFlightWithId])

    // Resetear formulario
    setNewFlight({
      airline: "",
      origin: "",
      destination: "",
      date: new Date(),
      capacity: "",
      basePrice: "",
      departureTime: "",
      arrivalTime: ""
    })
    
    // Resetear errores
    setErrors({
      date: "",
      departureTime: "",
      arrivalTime: ""
    })

    alert("Vuelo creado con éxito")
  }

  // Editar vuelo
  const handleEdit = (id) => {
    alert(`Editando vuelo con ID: ${id}`)
    // Aquí iría la lógica para editar un vuelo
  }

  // Eliminar vuelo
  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este vuelo?")) {
      setFlights(flights.filter((flight) => flight.id !== id))
    }
  }

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
                {flights.map((flight) => (
                  <tr key={flight.id} className={flight.status === "Activo" ? "active-row" : "inactive-row"}>
                    <td>{flight.id}</td>
                    <td>{flight.airline}</td>
                    <td>{flight.purchaseDate}</td>
                    <td>{flight.origin}</td>
                    <td>{flight.destination}</td>
                    <td>{flight.date}</td>
                    <td>{flight.departureTime}</td>
                    <td>{flight.arrivalTime}</td>
                    <td className={flight.status === "Activo" ? "status-active" : "status-inactive"}>
                      {flight.status}
                    </td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(flight.id)}>
                        Editar
                      </button>
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => handleDelete(flight.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario para crear nuevo vuelo */}
        <div className="create-flight-section">
          <h2 className="create-flight-title">Crear un vuelo</h2>

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

                <button type="button" className="exchange-button" onClick={handleExchangeLocations}>
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
                      minDate={new Date()} // No permitir fechas en el pasado
                      locale={es}
                    />
                  </div>
                  {errors.date && <p className="error-message">{errors.date}</p>}
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
                      min="1"
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
                      min="0"
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
                  {errors.departureTime && <p className="error-message">{errors.departureTime}</p>}
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
                  {errors.arrivalTime && <p className="error-message">{errors.arrivalTime}</p>}
                </div>
              </div>

              {/* Botón de crear */}
              <div className="create-button-container">
                <button type="button" className="create-button" onClick={handleCreateFlight}>
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightManagement