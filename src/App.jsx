import { useState, useEffect } from "react";
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
import AdminPanel from "./pages/Admin/AdminPanel.jsx";
import ModalLogin from "./components/ModalLogin/ModalLogin.jsx";
import ModalRegister from "./components/ModalRegister/ModalRegister.jsx";
import UserRoute from "./components/ProtectedRoutes/UserRoute.jsx";
import AdminRoute from "./components/ProtectedRoutes/AminRoute.jsx";
import AirlineAdminRoute from "./components/ProtectedRoutes/AirlineAdmin.jsx";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  // Seteo de estados
  const [modalVisible, setModalVisible] = useState(""); // Visualización del modal login o register
  const [user, setUser] = useState(null); // Inicializado en null ya que aún no se ha inicado sesión
  const [loading, setLoading] = useState(true); // No renderiza hasta que haya una sesión activa

  // Verificación del token al iniciar App
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si lo encuentra lo decodifica, si es inválido lo borra
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // Renderiza el contenido
  }, []);

  const closeModal = () => setModalVisible("");

  // Función que se ejecuta cuando el inicio de sesión es exitoso
  const handleLoginSuccess = ({ token }) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {}
    closeModal();
  };

  // Función para cerrar la sesión del usuario
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    closeModal();
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  // Función para actualizar la información del usuario
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

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
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />

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
          <Route
            path="/favorites"
            element={
              <UserRoute user={user} setModalVisible={setModalVisible}>
                <div className="page-container">
                  <h1>Mis Favoritos</h1>
                  <p>Esta página está en construcción</p>
                </div>
              </UserRoute>
            }
          />

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
                <AdminPanel />
              </AirlineAdminRoute>
            }
          />

          <Route
            path="/admin/accounts"
            element={
              <AdminRoute user={user} setModalVisible={setModalVisible}>
                <AdminPanel />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
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
      </Router>
    </div>
  );
}

export default App;
