import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home from "./pages/Home/Home.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Flights from "./pages/Flights/Flights";
import Checkout from "./pages/Checkout/Checkout.jsx";
import MyFlights from "./pages/MyFlights/MyFlights.jsx"; 
import AdminPanel from "./pages/Admin/AdminPanel.jsx"; 

import ModalLogin from "./components/ModalLogin/ModalLogin.jsx"; 
import ModalRegister from "./components/ModalRegister/ModalRegister.jsx"; 

import { jwtDecode } from "jwt-decode";

// Componente para proteger rutas de usuario (accesibles para 'user' y 'admin')
const UserRoute = ({ children, user, setModalVisible }) => { 
  const isUserOrAdmin = user && (user.role === "user" || user.role === "admin");

  if (!isUserOrAdmin) {

    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />; 
  }

  return children;
};

// Componente para proteger rutas de administrador (solo accesibles para 'admin')
const AdminRoute = ({ children, user, setModalVisible }) => { 
  const isAdmin = user && user.role === "admin";

  if (!isAdmin) {

    useEffect(() => {
      setModalVisible("login");
    }, [setModalVisible]);
    return <Navigate to="/" replace />; 
  }

  return children;
};

// Componente para proteger rutas de Aerolínea/Admin (accesibles para 'airline' y 'admin')
const AirlineAdminRoute = ({ children, user, setModalVisible }) => { 
  const isAirline = user && user.role === "airline";
  const isAdmin = user && user.role === "admin";

  console.log("DEBUG App.jsx AirlineAdminRoute: User:", user); 
  console.log("DEBUG App.jsx AirlineAdminRoute: isAirline:", isAirline); 
  console.log("DEBUG App.jsx AirlineAdminRoute: isAdmin:", isAdmin); 

  if (!isAirline && !isAdmin) {

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

//Efecto para la Carga Inicial (Verificación del Token)
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


  // Función que se ejecuta cuando el inicio de sesión es exitoso
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
        <Header modalVisible={setModalVisible} user={user} onLogout={handleLogout}  onUserUpdate={handleUserUpdate} />
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
          <ModalLogin closeModal={closeModal} openRegister={setModalVisible} onSubmit={handleLoginSuccess} />
        )}
        {modalVisible === "register" && <ModalRegister closeModal={closeModal} openLogin={setModalVisible} />}
      </Router>
    </div>
  );
}

export default App;