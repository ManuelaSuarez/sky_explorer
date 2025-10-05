import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../../contexts/ThemeContext";

const Header = ({ modalVisible, user, onLogout, onUserUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const hasAdminAirlineAccess = user && (user.role === "admin" || user.role === "airline");
  const isAdmin = user && user.role === "admin";

  const getUserFromToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return {
        ...decoded,
        profileImageUrl: decoded.profilePicture
          ? `http://localhost:3000/uploads/profile-pictures/${decoded.profilePicture}`
          : null,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      const userData = getUserFromToken();
      if (userData && onUserUpdate) onUserUpdate(userData);
    }
  }, [getUserFromToken, onUserUpdate, user]);

  useEffect(() => {
    if (hasAdminAirlineAccess) {
      const userOnlyRoutes = ["/favorites", "/myFlights", "/checkout"];
      if (location.pathname === "/" || userOnlyRoutes.some((route) => location.pathname.startsWith(route))) {
        navigate("/admin/flights");
      }
    }
  }, [hasAdminAirlineAccess, location.pathname, navigate]);

  const handleAuthClick = () => {
    if (user) {
      onLogout();
      if (location.pathname.includes("/admin")) navigate("/");
      else window.location.reload();
    } else {
      modalVisible("login");
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate(hasAdminAirlineAccess ? "/admin/flights" : "/");
  };

  const getInitials = useCallback(() => {
    if (!user?.name) return "US";
    return user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
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
                  <i className="fa-solid fa-plane"></i> <span>Vuelos</span>
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin/accounts" className="header_link">
                    <i className="fa-solid fa-user-cog"></i> <span>Cuentas</span>
                  </Link>
                </li>
              )}
            </>
          ) : (
            <>
              <li><i className="fa-solid fa-compass"></i> <span>Destinos</span></li>
              <li>
                <Link to="/favorites" className="header_link">
                  <i className="fa-solid fa-bookmark"></i> <span>Favoritos</span>
                </Link>
              </li>
              <li>
                <Link to="/myFlights" className="header_link">
                  <i className="fa-solid fa-passport"></i> <span>Mis Vuelos</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="header_user-section">
          {/* 🌞 Switch de tema */}
          <label className="theme-switch">
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>

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
            onUpdate={async (data) => {
              const res = await fetch(`http://localhost:3000/api/users/profile/me`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: data,
              });
              if (!res.ok) throw new Error("Error al actualizar");
              const updated = await res.json();
              onUserUpdate(updated.user);
            }}
            onDelete={async () => {
              await fetch(`http://localhost:3000/api/users/profile/me/with-bookings`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              });
              onLogout();
            }}
          />
        )}
      </div>
    </>
  );
};

export default Header;