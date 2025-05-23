
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaLock } from "react-icons/fa"
import { jwtDecode } from "jwt-decode"
import FlightManagement from "../FlightManagement/FlightManagement"
import AirlineManagement from "../AirlineManagement/AirlineManagement.jsx"
import "./AdminPanel.css"


const AdminPanel = () => {
  const [userRole, setUserRole] = useState(null) 
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Determinar qué sección mostrar basado en la URL
  const currentPath = location.pathname
  const activeSection = currentPath.includes("/accounts") ? "accounts" : "flights"

  // Función para verificar permisos del usuario
  const checkUserPermissions = () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setUserRole(null)
        setLoading(false)
        return
      }

      try {
        const payload = jwtDecode(token)
        setUserRole(payload.role) 
      } catch (error) {
        console.error("Error al decodificar el token en AdminPanel:", error)
        setUserRole(null)
      }
    } catch (error) {
      console.error("Error al verificar permisos en AdminPanel:", error)
      setUserRole(null)
    } finally {
      setLoading(false)
    }
  }

  // Verificar permisos al cargar el componente
  useEffect(() => {
    checkUserPermissions()
  }, [])

  // Verificar permisos cuando cambia la URL o el localStorage
  useEffect(() => {
    checkUserPermissions()
  }, [location.pathname]) 

  // Escuchar cambios en localStorage (para detectar inicio/cierre de sesión)
  useEffect(() => {
    const handleStorageChange = () => {
      checkUserPermissions()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Mostrar pantalla de carga mientras se verifica la autorización
  if (loading) {
    return <div className="loading-container">Verificando permisos...</div>
  }

  // Lógica de autorización basada en el rol y la sección activa
  let hasPermission = false;
  if (activeSection === "flights") {
    // Para la gestión de vuelos, se necesita 'admin' o 'airline'
    if (userRole === "admin" || userRole === "airline") {
      hasPermission = true;
    }
  } else if (activeSection === "accounts") {
    // Para la gestión de cuentas, solo se necesita 'admin'
    if (userRole === "admin") {
      hasPermission = true;
    }
  }

  // Mostrar mensaje de acceso denegado si no tiene los permisos necesarios para la sección
  if (!hasPermission) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-content">
          <FaLock className="access-denied-icon" />
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
          {activeSection === "accounts" ? (
            <p>Esta sección está reservada para administradores.</p>
          ) : (
            <p>Esta sección está reservada para administradores o aerolíneas.</p>
          )}
          <button className="back-button" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-content">
        {activeSection === "flights" && <FlightManagement />}
        {activeSection === "accounts" && <AirlineManagement />}
      </div>
    </div>
  )
}

export default AdminPanel