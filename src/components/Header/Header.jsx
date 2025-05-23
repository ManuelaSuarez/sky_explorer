"use client" // Esto es solo un indicador, no es un import de React

import "./Header.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react" // Asegúrate de importar useEffect

const Header = ({ modalVisible, user, onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // NUEVO: Definir si el usuario tiene acceso a la sección de administración/aerolínea
  const hasAdminAirlineAccess = user && (user.role === "admin" || user.role === "airline");

  // Verificar si el usuario es estrictamente administrador (para la sección "Cuentas")
  const isAdmin = user && user.role === "admin";

  // Efecto para redirigir a los usuarios con acceso de admin/aerolínea
  // si intentan acceder a páginas de usuario, o a la página principal.
  useEffect(() => {
    if (hasAdminAirlineAccess) {
      // Lista de rutas exclusivas para usuarios normales que no deberían ver admin/airline
      const userOnlyRoutes = ["/favorites", "/myFlights", "/checkout"]; // Dejo /flights porque puede ser vista por todos

      // Si el usuario con acceso especial está en la página principal (home)
      // o en alguna ruta exclusiva de usuario, redirigir a la sección de vuelos de admin/aerolínea
      if (location.pathname === "/" || userOnlyRoutes.some((route) => location.pathname.startsWith(route))) {
        navigate("/admin/flights");
      }
    }
  }, [hasAdminAirlineAccess, location.pathname, navigate]); // Dependencias para el useEffect

  const handleAuthClick = () => {
    if (user) {
      // Ejecutar la función de cierre de sesión
      onLogout();

      // Si el usuario está en la página de administración, redirigir a la página principal
      if (location.pathname.includes("/admin")) {
        navigate("/");
      } else {
        // En otras páginas, simplemente recargar para actualizar el estado (menos ideal pero funciona)
        window.location.reload();
      }
    } else {
      modalVisible("login");
    }
  };

  // Manejar el clic en el logo
  const handleLogoClick = (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del Link
    if (hasAdminAirlineAccess) { // Ahora usa la nueva variable
      navigate("/admin/flights"); // Redirigir a la sección de vuelos por defecto
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="header_container">
        {/* Logo con redirección condicional según el rol */}
        <div className="header_logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-globe"></i>
          <h1 className="header_title">Sky Explorer</h1>
        </div>

        <ul className="header_list">
          {hasAdminAirlineAccess ? ( // Usa la nueva variable aquí también
            // Menú para administradores y aerolíneas
            <>
              <li>
                <Link to="/admin/flights" className="header_link">
                  <i className="fa-solid fa-plane"></i>
                  <span>Vuelos</span>
                </Link>
              </li>
              {isAdmin && ( // "Cuentas" solo si es estrictamente 'admin'
                <li>
                  <Link to="/admin/accounts" className="header_link">
                    <i className="fa-solid fa-user-cog"></i>
                    <span>Cuentas</span>
                  </Link>
                </li>
              )}
            </>
          ) : (
            // Menú para usuarios normales (o si no tiene acceso de admin/aerolínea)
            <>
              <li>
                {/* Puedes mantener este como un Link a /flights o si es un icono sin navegación, dejarlo como está */}
                <i className="fa-solid fa-compass"></i>
                <span>Destinos</span> {/* Si esto es solo un label, está bien. Si debe navegar, necesita un Link */}
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
          {/* El enlace a "Vuelos" general puede ir fuera de la condición si es accesible para todos */}
          {/* Ejemplo:
          <li>
            <Link to="/flights" className="header_link">
              <i className="fa-solid fa-plane"></i>
              <span>Buscar Vuelos</span>
            </Link>
          </li>
          */}
        </ul>

        <div className="header_user">
          {user && <span className="user-email">Hola, {user.name || "Usuario"}</span>}
          <button className="header_signIn" onClick={handleAuthClick}>
            {user ? "Cerrar Sesión" : "Iniciar Sesión"} <i className="fa-solid fa-user"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;