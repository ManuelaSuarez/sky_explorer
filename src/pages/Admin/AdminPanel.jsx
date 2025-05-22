"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaLock } from "react-icons/fa"
import { jwtDecode } from "jwt-decode"
import FlightManagement from "../FlightManagement/FlightManagement"
import AccountManagement from "../AccountManagement/AccountManagement"
import "./AdminPanel.css"

const AdminPanel = () => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Determinar qué sección mostrar basado en la URL
  const currentPath = location.pathname
  const activeSection = currentPath.includes("/accounts") ? "accounts" : "flights"

  // Función para verificar permisos de administrador
  const checkAdminPermission = () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsAuthorized(false)
        setLoading(false)
        return
      }

      try {
        const payload = jwtDecode(token)

        if (payload.role === "admin") {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error)
        setIsAuthorized(false)
      }
    } catch (error) {
      console.error("Error al verificar permisos:", error)
      setIsAuthorized(false)
    } finally {
      setLoading(false)
    }
  }

  // Verificar permisos al cargar el componente
  useEffect(() => {
    checkAdminPermission()
  }, [])

  // Verificar permisos cuando cambia la URL (por si el usuario navega manualmente)
  useEffect(() => {
    checkAdminPermission()
  }, [location.pathname])

  // Escuchar cambios en localStorage (para detectar inicio/cierre de sesión)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAdminPermission()
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

  // Mostrar mensaje de acceso denegado si no está autorizado
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
    )
  }

  return (
    <div className="admin-panel-container">
      {/* Contenido */}
      {activeSection === "flights" && <FlightManagement />}
      {activeSection === "accounts" && <AccountManagement />}
    </div>
  )
}

export default AdminPanel
