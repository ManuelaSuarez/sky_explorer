import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import { jwtDecode } from "jwt-decode";

const Header = ({ modalVisible, user, onLogout, onUserUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const hasAdminAirlineAccess = user && (user.role === "admin" || user.role === "airline");
  const isAdmin = user && user.role === "admin";

  // Función para obtener usuario del token (memoizada)
  const getUserFromToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return {
        ...decoded,
        profilePicture: decoded.profilePicture || null,
        profileImageUrl: decoded.profilePicture 
          ? `http://localhost:3000/uploads/profile-pictures/${decoded.profilePicture}`
          : null
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      return null;
    }
  }, []);

  // Efecto para cargar usuario al montar - SOLO UNA VEZ
  useEffect(() => {
    const loadUser = () => {
      const userData = getUserFromToken();
      if (userData && onUserUpdate) {
        onUserUpdate(userData);
      }
    };

    // Solo cargar si no hay usuario actual
    if (!user) {
      loadUser();
    }
  }, [getUserFromToken, onUserUpdate, user]); // Agregar user como dependencia

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
      onLogout();
      if (location.pathname.includes("/admin")) {
        navigate("/");
      } else {
        window.location.reload();
      }
    } else {
      modalVisible("login");
    }
  };

  // Función para manejar el clic en el logo (redirige según el rol)
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (hasAdminAirlineAccess) {
      navigate("/admin/flights");
    } else {
      navigate("/");
    }
  };

  // Función para actualizar el perfil del usuario (memoizada)
  const handleUpdateProfile = useCallback(async (updateData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/profile/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: updateData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const updatedUserResponse = await response.json();
      
      // Actualizar el token si viene en la respuesta
      if (updatedUserResponse.token) {
        localStorage.setItem("token", updatedUserResponse.token);
      }

      // Construir la URL completa de la imagen
      const updatedUser = {
        ...updatedUserResponse.user,
        profileImageUrl: updatedUserResponse.user.profilePicture 
          ? `http://localhost:3000/uploads/profile-pictures/${updatedUserResponse.user.profilePicture}`
          : null
      };

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setShowProfileModal(false);
      return updatedUserResponse;
    } catch (error) {
      throw error;
    }
  }, [onUserUpdate]);

  // Función para eliminar la cuenta del usuario (memoizada)
  const handleDeleteAccount = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/profile/me/with-bookings`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la cuenta");
      }

      setShowProfileModal(false);
      onLogout();
    } catch (error) {
      throw error;
    }
  }, [onLogout]);

  // Función para obtener las iniciales del nombre del usuario para el avatar
  const getInitials = useCallback(() => {
    if (!user?.name) return "US";
    const names = user.name.split(" ");
    return names.map(name => name[0]).join("").toUpperCase();
  }, [user]);

  return (
    <>
      <div className="header_container">
        <div className="header_logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-globe"></i>
          <h1 className="header_title">Sky Explorer</h1>
        </div>

        <ul className="header_list">
          {hasAdminAirlineAccess ? (
            <>
              <li>
                <Link to="/admin/flights" className="header_link">
                  <i className="fa-solid fa-plane"></i>
                  <span>Vuelos</span>
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin/accounts" className="header_link">
                    <i className="fa-solid fa-user-cog"></i>
                    <span>Cuentas</span>
                  </Link>
                </li>
              )}
            </>
          ) : (
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
          {user && (
            <div className="user-profile-container">
              <span className="user-greeting">Hola, {user.name || "Usuario"}</span>
              <div
                className="user-avatar"
                onClick={() => setShowProfileModal(true)}
                title="Mi perfil"
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Perfil"
                    className="user-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="avatar-initials">{getInitials()}</span>
                )}
              </div>
            </div>
          )}
          <button
            className="header_signIn"
            onClick={handleAuthClick}
            title={user ? "Cerrar sesión" : "Iniciar sesión"}
          >
            {user ? "Cerrar Sesión" : "Iniciar Sesión"}
          </button>
        </div>

        {showProfileModal && user && (
          <UserProfileModal
            user={user}
            onClose={() => setShowProfileModal(false)}
            onUpdate={handleUpdateProfile}
            onDelete={handleDeleteAccount}
          />
        )}
      </div>
    </>
  );
};

export default Header;