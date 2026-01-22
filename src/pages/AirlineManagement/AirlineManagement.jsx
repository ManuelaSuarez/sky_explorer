import { useState, useEffect } from "react"
import "./AirlineManagement.css"
import { FaUser, FaGlobe, FaIdCard, FaTrash, FaCog } from "react-icons/fa"
import { toast } from "react-toastify"
import { showConfirmToast } from "../../utils/toasts/confirmToast"

const AirlineManagement = () => {
  const [airlines, setAirlines] = useState([])
  const [newAirline, setNewAirline] = useState({
    name: "",
    code: "",
    cuit: "",
    email: "",
    password: "",
  })
  const [editingAirlineId, setEditingAirlineId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getToken = () => {
    return localStorage.getItem("token")
  }

  // Obtener aerolíneas 
  const fetchAirlines = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No autenticado. Por favor inicie sesión.")
      }

      const response = await fetch("http://localhost:3000/api/airlines", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al cargar aerolíneas.")
      }

      const data = await response.json()
      setAirlines(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAirlines()
  }, [])

  // Maneja cambios en el form
  const handleAirlineInputChange = (e) => {
    const { name, value } = e.target
    setNewAirline({ ...newAirline, [name]: value })
  }

  // Maneja la creación de aerolíneas
  const handleCreateAirline = async () => {
    // Verifica que los campos estén completos
    if (
      !newAirline.name ||
      !newAirline.code ||
      !newAirline.cuit ||
      !newAirline.email ||
      !newAirline.password
    ) {
      toast.warning("Por favor, complete todos los campos.")
      return
    }

    // Valida formato del CUIT
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    if (!cuitRegex.test(newAirline.cuit)) {
      toast.warning("El formato del CUIT debe ser XX-XXXXXXXX-X")
      return
    }

    // Valida formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newAirline.email)) {
      toast.warning("El formato del email no es válido")
      return
    }

    // Valida que la contraseña sea mayor a 7 caracteres
    if (newAirline.password.length < 7) {
      toast.warning("La contraseña debe tener al menos 7 caracteres.")
      return
    }

    showConfirmToast("¿Deseas crear esta nueva aerolínea?", async () => {
      try {
        const token = getToken()
        if (!token) {
          throw new Error("No autenticado. Por favor inicie sesión.")
        }

        const response = await fetch("http://localhost:3000/api/airlines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAirline),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear aerolínea.")
        }

        const createdAirline = await response.json()
        setAirlines([createdAirline, ...airlines]) // Agrega la nueva aerolínea al estado local
        setNewAirline({ name: "", code: "", cuit: "", email: "", password: "" }) // Limpiar formulario
      } catch (err) {
        toast.error(`Error: ${err.message}`)
      }
    })
  }

  // Maneja la eliminación de aerolíneas
  const handleDeleteAirline = async (id) => {
    showConfirmToast("¿Está seguro que desea eliminar esta aerolínea?", async () => {
      try {
        const token = getToken()
        if (!token) {
          throw new Error("No autenticado. Por favor inicie sesión.")
        }

        const response = await fetch(`http://localhost:3000/api/airlines/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al eliminar aerolínea.")
        }

        setAirlines(airlines.filter((airline) => airline.id !== id))
      } catch (err) {
        toast.warning(`Error: ${err.message}`)
      }
    })
    
  }

  // Carga los campos en el form para la posterior edición
  const handleEditAirline = (id) => {
    setEditingAirlineId(id)
    const airlineToEdit = airlines.find((airline) => airline.id === id)
    setNewAirline({ ...airlineToEdit, password: "" }) // No cargar la contraseña para edición
  }

  // Maneja la edición de aerolíneas
  const handleUpdateAirline = async () => {
    // Valida los campos y sus formatos
    if (
      !newAirline.name ||
      !newAirline.code ||
      !newAirline.cuit ||
      !newAirline.email
    ) {
      toast.warning("Por favor, complete todos los campos.")
      return
    }

    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    if (!cuitRegex.test(newAirline.cuit)) {
      toast.warning("El formato del CUIT debe ser XX-XXXXXXXX-X")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newAirline.email)) {
      toast.warning("El formato del email no es válido")
      return
    }

    if (newAirline.password && newAirline.password.length < 7) {
      toast.warning("La contraseña debe tener al menos 7 caracteres.")
      return
    }

    showConfirmToast("¿Deseas guardar los cambios de esta aerolínea?", async () => {
      try {
        const token = getToken()
        if (!token) {
          throw new Error("No autenticado. Por favor inicie sesión.")
        }

        const response = await fetch(
          `http://localhost:3000/api/airlines/${editingAirlineId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: newAirline.name,
              code: newAirline.code,
              cuit: newAirline.cuit,
              email: newAirline.email,
            }), // No se envía la contraseña al actualizar
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar aerolínea.")
        }

        // Reemplaza la aerolínea editada en airlines
        const updatedAirline = await response.json()
        setAirlines(
          airlines.map((airline) =>
            airline.id === editingAirlineId ? updatedAirline : airline
          )
        )

        // Sale del modo edición.
        setEditingAirlineId(null)

        // Limpia el formulario.
        setNewAirline({ name: "", code: "", cuit: "", email: "", password: "" }) // Limpiar formulario
      } catch (err) {
        toast.error(`Error: ${err.message}`)
      }
    })
  }

  // Sale del modo edición
  const handleCancelEdit = () => {
    setEditingAirlineId(null)
    setNewAirline({ name: "", code: "", cuit: "", email: "", password: "" })
  }

  if (loading) {
    return (
      <div className="airline-management-container">Cargando aerolíneas...</div>
    )
  }

  if (error) {
    return (
      <div className="airline-management-container error-message">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="airline-management-container">
      <h2>Administración de Aerolíneas</h2>

      {/* La lista de aerolíneas va primero */}
      <div className="airline-list">
        <h3>Lista de Aerolíneas</h3>
        {airlines.length === 0 ? (
          <p>No hay aerolíneas registradas.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Código</th>
                <th>CUIT</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline) => (
                <tr key={airline.id}>
                  <td>{airline.id}</td>
                  <td>{airline.name}</td>
                  <td>{airline.code}</td>
                  <td>{airline.cuit}</td>
                  <td>{airline.email}</td>
                  <td className="action-buttons">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAirline(airline.id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="settings-button"
                      onClick={() => handleEditAirline(airline.id)}
                    >
                      <FaCog />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Luego el formulario de creación/edición */}
      <div className="airline-form">
        <h3>
          {editingAirlineId ? "Editar Aerolínea" : "Crear Nueva Aerolínea"}
        </h3>
        <div className="form-group">
          <label>Nombre Aerolínea</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              value={newAirline.name}
              onChange={handleAirlineInputChange}
              placeholder="Nombre Aerolínea"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Código IATA</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="code"
              value={newAirline.code}
              onChange={handleAirlineInputChange}
              placeholder="Código IATA Aerolínea"
            />
          </div>
        </div>

        <div className="form-group">
          <label>CUIT</label>
          <div className="input-with-icon">
            <FaGlobe className="input-icon" />
            <input
              type="text"
              name="cuit"
              pattern="\d{2}-\d{8}-\d{1}"
              value={newAirline.cuit}
              onChange={handleAirlineInputChange}
              placeholder="CUIT Aerolínea"
            />
          </div>
        </div>

        <div className="form-group">
          <label>EMAIL</label>
          <div className="input-with-icon">
            <FaIdCard className="input-icon" />
            <input
              type="email"
              name="email"
              value={newAirline.email}
              onChange={handleAirlineInputChange}
              placeholder="Email Aerolínea"
            />
          </div>
        </div>

        {!editingAirlineId && (
          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <FaIdCard className="input-icon" />
              <input
                type="password"
                name="password"
                value={newAirline.password}
                onChange={handleAirlineInputChange}
                placeholder="Contraseña"
              />
            </div>
          </div>
        )}

        {editingAirlineId ? (
          <div className="form-actions">
            <button className="update-button" onClick={handleUpdateAirline}>
              Actualizar
            </button>
            <button className="cancel-button" onClick={handleCancelEdit}>
              Cancelar
            </button>
          </div>
        ) : (
          <button className="create-button" onClick={handleCreateAirline}>
            Crear Aerolínea
          </button>
        )}
      </div>
    </div>
  )
}

export default AirlineManagement
