"use client"

import "./Header.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Header = ({ modalVisible, user, onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Verificar si el usuario es administrador
  const isAdmin = user && user.role === "admin"

  // Efecto para redirigir a los administradores si intentan acceder a páginas de usuario
  useEffect(() => {
    if (isAdmin) {
      // Lista de rutas exclusivas para usuarios normales
      const userOnlyRoutes = ["/favorites", "/myFlights", "/flights", "/checkout"]

      // Si el admin está en la página principal (home), redirigir a la sección de admin
      if (location.pathname === "/") {
        navigate("/admin/flights")
      }

      // Si el admin está en alguna ruta exclusiva de usuario, redirigir a la sección de admin
      if (userOnlyRoutes.some((route) => location.pathname.startsWith(route))) {
        navigate("/admin/flights")
      }
    }
  }, [isAdmin, location.pathname, navigate])

  const handleAuthClick = () => {
    if (user) {
      // Ejecutar la función de cierre de sesión
      onLogout()

      // Si el usuario está en la página de administración, redirigir a la página principal
      if (location.pathname.includes("/admin")) {
        navigate("/")
      } else {
        // En otras páginas, simplemente recargar para actualizar el estado
        window.location.reload()
      }
    } else {
      modalVisible("login")
    }
  }

  // Manejar el clic en el logo
  const handleLogoClick = (e) => {
    e.preventDefault()
    if (isAdmin) {
      navigate("/admin/flights") // Redirigir a la sección de vuelos por defecto
    } else {
      navigate("/")
    }
  }

  return (
    <>
      <div className="header_container">
        {/* Logo con redirección condicional según el rol */}
        <div className="header_logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-globe"></i>
          <h1 className="header_title">Sky Explorer</h1>
        </div>

        <ul className="header_list">
          {isAdmin ? (
            // Menú para administradores
            <>
              <li>
                <Link to="/admin/flights" className="header_link">
                  <i className="fa-solid fa-plane"></i>
                  <span>Vuelos</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/accounts" className="header_link">
                  <i className="fa-solid fa-user-cog"></i>
                  <span>Cuentas</span>
                </Link>
              </li>
            </>
          ) : (
            // Menú para usuarios normales
            <>
              <li>
                  <i className="fa-solid fa-compass"></i>
                  <span>Destinos</span>
              </li>
              <li>
                <Link to="/favorites" className="header_link">
                  <i className="fa-solid fa-bookmark"></i>
                  <span>Favoritos</span>
                </Link>
              </li>
              <li>
                <Link to="/myFlights" className="header_link">
                  <i className="fa-solid fa-passport"></i>
                  <span>Mis Vuelos</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="header_user">
          {user && <span className="user-email">Hola, {user.name || user.username || "Usuario"}</span>}
          <button className="header_signIn" onClick={handleAuthClick}>
            {user ? "Cerrar Sesión" : "Iniciar Sesión"} <i className="fa-solid fa-user"></i>
          </button>
        </div>
      </div>
    </>
  )
}

export default Header
