import "./Header.css"; // Asegúrate de tener este archivo CSS con los estilos
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserProfileModal from "../UserProfileModal/UserProfileModal";

const Header = ({ modalVisible, user, onLogout, onUserUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const hasAdminAirlineAccess = user && (user.role === "admin" || user.role === "airline");
  const isAdmin = user && user.role === "admin";

  // Efecto para redirigir a usuarios con roles específicos
  useEffect(() => {
    if (hasAdminAirlineAccess) {
      const userOnlyRoutes = ["/favorites", "/myFlights", "/checkout"];
      if (location.pathname === "/" || userOnlyRoutes.some((route) => location.pathname.startsWith(route))) {
        navigate("/admin/flights");
      }
    }
  }, [hasAdminAirlineAccess, location.pathname, navigate]);

  // Función para manejar el clic en "Iniciar Sesión" / "Cerrar Sesión"
  const handleAuthClick = () => {
    if (user) {
      onLogout(); // Si hay usuario, cierra sesión
      // Redirige después de cerrar sesión, si está en una ruta de admin, va a la raíz
      if (location.pathname.includes("/admin")) {
        navigate("/");
      } else {
        window.location.reload(); // Recarga la página si no está en admin
      }
    } else {
      modalVisible("login"); // Si no hay usuario, abre el modal de login
    }
  };

  // Función para manejar el clic en el logo (redirige según el rol)
  const handleLogoClick = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del link
    if (hasAdminAirlineAccess) {
      navigate("/admin/flights"); // Admins/Aerolíneas van a vuelos de admin
    } else {
      navigate("/"); // Usuarios normales van a la página de inicio
    }
  };

  // Función para actualizar el perfil del usuario (llamada desde UserProfileModal)
  const handleUpdateProfile = async (updateData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Envía el token de autenticación
        },
        body: JSON.stringify(updateData) // Envía los datos del formulario
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const updatedUserResponse = await response.json();

      // Si el backend envía un nuevo token (ej. si el email cambió), lo guarda
      if (updatedUserResponse.token) {
        localStorage.setItem("token", updatedUserResponse.token);
      }

      // Actualiza el estado del usuario en el componente padre (App.js)
      if (onUserUpdate && updatedUserResponse.user) {
        onUserUpdate(updatedUserResponse.user);
      }

      setShowProfileModal(false); // Cierra el modal de perfil
      return updatedUserResponse;
    } catch (error) {
      throw error; // Propaga el error para que el modal lo muestre
    }
  };

  // Función para eliminar la cuenta del usuario (llamada desde UserProfileModal)
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/profile/me/with-bookings`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Envía el token de autenticación
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la cuenta");
      }

      setShowProfileModal(false); // Cierra el modal de perfil
      onLogout(); // Cierra la sesión del usuario
    } catch (error) {
      throw error; // Propaga el error para que el modal lo muestre
    }
  };

  // Función para obtener las iniciales del nombre del usuario para el avatar
  const getInitials = () => {
    if (!user?.name) return "US"; // Si no hay nombre, muestra "US"
    const names = user.name.split(" "); // Divide el nombre por espacios
    return names.map(name => name[0]).join("").toUpperCase(); // Toma la primera letra de cada palabra y las une
  };

  return (
    <>
      <div className="header_container">
        <div className="header_logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-globe"></i>
          <h1 className="header_title">Sky Explorer</h1>
        </div>

        <ul className="header_list">
          {hasAdminAirlineAccess ? (
            // Links para usuarios con rol de admin/aerolínea
            <>
              <li>
                <Link to="/admin/flights" className="header_link">
                  <i className="fa-solid fa-plane"></i>
                  <span>Vuelos</span>
                </Link>
              </li>
              {isAdmin && ( // Solo para admins
                <li>
                  <Link to="/admin/accounts" className="header_link">
                    <i className="fa-solid fa-user-cog"></i>
                    <span>Cuentas</span>
                  </Link>
                </li>
              )}
            </>
          ) : (
            // Links para usuarios normales
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

        <div className="header_user-section">
          {user && ( // Sección de usuario si hay un usuario logueado
            <div className="user-profile-container">
              <span className="user-greeting">Hola, {user.name || "Usuario"}</span>
              <div
                className="user-avatar"
                onClick={() => setShowProfileModal(true)} // Abre el modal de perfil al hacer clic
                title="Mi perfil"
              >
                {user?.name ? (
                  <span className="avatar-initials">{getInitials()}</span> // Muestra iniciales si hay nombre
                ) : (
                  <i className="fa-solid fa-user"></i> // Icono genérico si no hay nombre
                )}
              </div>
            </div>
          )}
          <button
            className="header_signIn"
            onClick={handleAuthClick} // Maneja login/logout
            title={user ? "Cerrar sesión" : "Iniciar sesión"}
          >
            {user ? "Cerrar Sesión" : "Iniciar Sesión"}
          </button>
        </div>

        {/* Renderiza UserProfileModal si showProfileModal es true y hay un usuario */}
        {showProfileModal && user && (
          <UserProfileModal
            user={user} // Pasa los datos del usuario
            onClose={() => setShowProfileModal(false)} // Función para cerrar el modal
            onUpdate={handleUpdateProfile} // Función para actualizar el perfil
            onDelete={handleDeleteAccount} // Función para eliminar la cuenta
            isAdmin={isAdmin} // Pasa si es admin (aunque no se usa directamente en este modal)
          />
        )}
      </div>
    </>
  );
};

export default Header;