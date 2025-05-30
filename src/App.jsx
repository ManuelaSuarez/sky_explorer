import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home from "./pages/Home/Home.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Flights from "./pages/Flights/Flights";
import Checkout from "./pages/Checkout/Checkout.jsx";
import MyFlights from "./pages/MyFlights/MyFlights.jsx"; // Make sure MyFlights is imported
import AdminPanel from "./pages/Admin/AdminPanel.jsx"; 

import ModalLogin from "./components/ModalLogin/ModalLogin.jsx"; 
import ModalRegister from "./components/ModalRegister/ModalRegister.jsx"; 

import { jwtDecode } from "jwt-decode";

// Componente para proteger rutas de usuario (accesibles para 'user' y 'admin')
const UserRoute = ({ children, user, setModalVisible }) => { // Added setModalVisible
  const isUserOrAdmin = user && (user.role === "user" || user.role === "admin");

  if (!isUserOrAdmin) {
    // Instead of navigating, open the login modal
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />; // Still navigate away from the protected route
  }

  return children;
};

// Componente para proteger rutas de administrador (solo accesibles para 'admin')
const AdminRoute = ({ children, user, setModalVisible }) => { // Added setModalVisible
  const isAdmin = user && user.role === "admin";

  if (!isAdmin) {
    // Instead of navigating, open the login modal
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />; 
  }

  return children;
};

// Componente para proteger rutas de Aerolínea/Admin (accesibles para 'airline' y 'admin')
const AirlineAdminRoute = ({ children, user, setModalVisible }) => { // Added setModalVisible
  const isAirline = user && user.role === "airline";
  const isAdmin = user && user.role === "admin";

  console.log("DEBUG App.jsx AirlineAdminRoute: User:", user); 
  console.log("DEBUG App.jsx AirlineAdminRoute: isAirline:", isAirline); 
  console.log("DEBUG App.jsx AirlineAdminRoute: isAdmin:", isAdmin); 

  if (!isAirline && !isAdmin) {
    // Instead of navigating, open the login modal
    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />; 
  }
  return children;
};


function App() {
  const [modalVisible, setModalVisible] = useState(""); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log("DEBUG App.jsx useEffect: Decoded User:", decoded); 
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const closeModal = () => setModalVisible("");

  const handleLoginSuccess = ({ token }) => { 
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      console.log("DEBUG App.jsx handleLoginSuccess: Decoded User:", decoded); 
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    closeModal();
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="app">
      <Router>
        <Header modalVisible={setModalVisible} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/flights" element={<Flights />} /> 

          <Route
            path="/checkout"
            element={
              <UserRoute user={user} setModalVisible={setModalVisible}> {/* Pass setModalVisible */}
                <Checkout />
              </UserRoute>
            }
          />
          <Route
            path="/myFlights"
            element={
              <UserRoute user={user} setModalVisible={setModalVisible}> {/* Pass setModalVisible */}
                <MyFlights setModalVisible={setModalVisible} /> {/* Pass setModalVisible to MyFlights */}
              </UserRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <UserRoute user={user} setModalVisible={setModalVisible}> {/* Pass setModalVisible */}
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
              <AirlineAdminRoute user={user} setModalVisible={setModalVisible}> {/* Pass setModalVisible */}
                <Navigate to="/admin/flights" replace />
              </AirlineAdminRoute>
            }
          />
          <Route
            path="/admin/flights"
            element={
              <AirlineAdminRoute user={user} setModalVisible={setModalVisible}> {/* Pass setModalVisible */}
                <AdminPanel />
              </AirlineAdminRoute>
            }
          />

          <Route
            path="/admin/accounts"
            element={
              <AdminRoute user={user} setModalVisible={setModalVisible}> {/* Pass setModalVisible */}
                <AdminPanel />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        {modalVisible === "login" && (
          <ModalLogin closeModal={closeModal} openRegister={setModalVisible} onSubmit={handleLoginSuccess} />
        )}
        {modalVisible === "register" && <ModalRegister closeModal={closeModal} openLogin={setModalVisible} />}
      </Router>
    </div>
  );
}

export default App;