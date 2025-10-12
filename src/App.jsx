// App.jsx
import { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Flights from "./pages/Flights/Flights";
import Checkout from "./pages/Checkout/Checkout.jsx";
import MyFlights from "./pages/MyFlights/MyFlights.jsx";
import FlightManagement from "./pages/FlightManagement/FlightManagement.jsx";
import AirlineManagement from "./pages/AirlineManagement/AirlineManagement.jsx";
import Favorites from "./pages/Favorites/Favorites.jsx";
import ModalLogin from "./components/ModalLogin/ModalLogin.jsx";
import ModalRegister from "./components/ModalRegister/ModalRegister.jsx";
import UserRoute from "./components/ProtectedRoutes/UserRoute.jsx";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute.jsx";
import AirlineAdminRoute from "./components/ProtectedRoutes/AirlineAdmin.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast, Bounce  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Estados
  const [modalVisible, setModalVisible] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el perfil del usuario desde el backend
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        const userWithFullImageUrl = {
          ...userData,
          profileImageUrl: userData.profilePicture
            ? `http://localhost:3000/uploads/profile-pictures/${userData.profilePicture}`
            : null,
        };
        setUser(userWithFullImageUrl);
      } else {
        console.error("Token inválido o expirado. Vuelve a iniciar sesión.");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const closeModal = () => setModalVisible("");

  const handleLoginSuccess = async ({ token }) => {
    try {
      localStorage.setItem("token", token);
      await fetchUserProfile();
    } catch (error) {
      console.error("Error al decodificar token o obtener perfil:", error);
    }
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    closeModal();
  };

  const handleUserUpdate = (updatedUser) => setUser(updatedUser);

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <div className="app">
      <Router>
        <Header
          modalVisible={setModalVisible}
          user={user}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
        />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />

          {/* Rutas protegidas para usuarios */}
          <Route
            path="/checkout"
            element={
              <UserRoute user={user} setModalVisible={setModalVisible}>
                <Checkout />
              </UserRoute>
            }
          />
          <Route
            path="/myFlights"
            element={
              <UserRoute user={user} setModalVisible={setModalVisible}>
                <MyFlights setModalVisible={setModalVisible} />
              </UserRoute>
            }
          />

          {/* 👇 2) RUTA NUEVA DE FAVORITOS */}
          <Route
            path="/favorites"
            element={
              <UserRoute user={user} setModalVisible={setModalVisible}>
                <Favorites />
              </UserRoute>
            }
          />

          {/* Rutas administrativas - Gestión de vuelos (Admin + Airline) */}
          <Route
            path="/admin"
            element={
              <AirlineAdminRoute user={user} setModalVisible={setModalVisible}>
                <Navigate to="/admin/flights" replace />
              </AirlineAdminRoute>
            }
          />
          <Route
            path="/admin/flights"
            element={
              <AirlineAdminRoute user={user} setModalVisible={setModalVisible}>
                <FlightManagement />
              </AirlineAdminRoute>
            }
          />

          {/* Rutas administrativas - Gestión de aerolíneas (Solo Admin) */}
          <Route
            path="/admin/accounts"
            element={
              <AdminRoute user={user} setModalVisible={setModalVisible}>
                <AirlineManagement />
              </AdminRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />

        {/* Modales */}
        {modalVisible === "login" && (
          <ModalLogin
            closeModal={closeModal}
            openRegister={setModalVisible}
            onSubmit={handleLoginSuccess}
          />
        )}
        {modalVisible === "register" && (
          <ModalRegister closeModal={closeModal} openLogin={setModalVisible} />
        )}
        {/* Contenedor global de toasts */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </Router>
    </div>
  );
}

export default App;