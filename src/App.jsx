"use client"

import { useState, useEffect } from "react"
import "./App.css"
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"
import "@fortawesome/fontawesome-free/css/all.min.css"
import Home from "./pages/Home/Home.jsx"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Flights from "./pages/Flights/Flights"
import Checkout from "./pages/Checkout/Checkout.jsx"
import MyFlights from "./pages/MyFlights/MyFlights.jsx"
import AdminPanel from "./pages/Admin/AdminPanel.jsx"

// Modales de autenticación
import ModalLogin from "./components/ModalLogin/ModalLogin.jsx"
import ModalRegister from "./components/ModalRegister/ModalRegister.jsx"
// Importar jwtDecode correctamente
import { jwtDecode } from "jwt-decode"

// Componente para proteger rutas de usuario (solo accesibles para usuarios normales)
const UserRoute = ({ children, user }) => {
  const isAdmin = user && user.role === "admin"

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}

// Componente para proteger rutas de administrador (solo accesibles para administradores)
const AdminRoute = ({ children, user }) => {
  const isAdmin = user && user.role === "admin"

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [modalVisible, setModalVisible] = useState("") // "login" | "register" | ""
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (error) {
        console.error("Token inválido:", error)
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }, [])

  const closeModal = () => setModalVisible("")

  const handleLoginSuccess = ({ token, user }) => {
    try {
      localStorage.setItem("token", token)
      // Si recibimos el usuario directamente, lo usamos
      if (user) {
        setUser(user)
      } else {
        // Si no, intentamos decodificar el token
        const decoded = jwtDecode(token)
        setUser(decoded)
      }
      // La redirección ahora se maneja en el componente ModalLogin
    } catch (error) {
      console.error("Error al decodificar el token:", error)
    }
    closeModal()
  }

  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem("token")

    // Actualizar el estado del usuario
    setUser(null)

    // Disparar un evento de storage para que otros componentes se enteren
    window.dispatchEvent(new Event("storage"))

    // Cerrar cualquier modal abierto
    closeModal()
  }

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return <div className="loading-container">Cargando...</div>
  }

  return (
    <div className="app">
      <Router>
        <Header modalVisible={setModalVisible} user={user} onLogout={handleLogout} />
        <Routes>
          {/* Rutas para usuarios normales */}
          <Route
            path="/"
            element={
              <UserRoute user={user}>
                <Home />
              </UserRoute>
            }
          />
          <Route
            path="/flights"
            element={
              <UserRoute user={user}>
                <Flights />
              </UserRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <UserRoute user={user}>
                <Checkout />
              </UserRoute>
            }
          />
          <Route
            path="/myFlights"
            element={
              <UserRoute user={user}>
                <MyFlights />
              </UserRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <UserRoute user={user}>
                <div className="page-container">
                  <h1>Mis Favoritos</h1>
                  <p>Esta página está en construcción</p>
                </div>
              </UserRoute>
            }
          />

          {/* Rutas para administradores */}
          <Route
            path="/admin"
            element={
              <AdminRoute user={user}>
                <Navigate to="/admin/flights" replace />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/flights"
            element={
              <AdminRoute user={user}>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/accounts"
            element={
              <AdminRoute user={user}>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* Ruta para manejar rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        {modalVisible === "login" && (
          <ModalLogin closeModal={closeModal} openRegister={setModalVisible} onSubmit={handleLoginSuccess} />
        )}
        {modalVisible === "register" && <ModalRegister closeModal={closeModal} openLogin={setModalVisible} />}
      </Router>
    </div>
  )
}

export default App
