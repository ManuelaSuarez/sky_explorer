import { useState, useEffect } from "react"
import "./App.css"
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"
import "@fortawesome/fontawesome-free/css/all.min.css"
import Home from "./pages/Home/Home.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Flights from "./pages/Flights/Flights"
import Checkout from "./pages/Checkout/Checkout.jsx"
import MyFlights from "./pages/MyFlights/MyFlights.jsx"
import FlightManagement from "./pages/Admin/FlightManagement.jsx"
// Modales de autenticación
import ModalLogin from "./components/ModalLogin/ModalLogin.jsx"
import ModalRegister from "./components/ModalRegister/ModalRegister.jsx"
// ✅ Importá jwt-decode
import { jwtDecode } from "jwt-decode"
function App() {
  const [modalVisible, setModalVisible] = useState("") // "login" | "register" | ""
  const [user, setUser] = useState(null)
  // ✅ Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token) // ✅ Usás token dentro del mismo scope
        setUser(decoded)
      } catch (error) {
        console.error("Token inválido:", error)
        localStorage.removeItem("token")
      }
    }
  }, [])
  const closeModal = () => setModalVisible("")
  const handleLoginSuccess = ({ token }) => {
    try {
      localStorage.setItem("token", token)
      const decoded = jwt_decode(token)
      setUser(decoded)
    } catch (error) {
      console.error("Error al decodificar el token:", error)
    }
    closeModal()
  }
  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }
  return (
    <div className="app">
      <Router>
        <Header modalVisible={setModalVisible} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myFlights" element={<MyFlights />} />
          <Route path="/admin/flights" element={<FlightManagement />} />
        </Routes>
        <Footer />
        {modalVisible === "login" && (
          <ModalLogin closeModal={closeModal} openRegister={setModalVisible}
            onSubmit={handleLoginSuccess} />
        )}
        {modalVisible === "register" && <ModalRegister closeModal={closeModal}
          openLogin={setModalVisible} />}
      </Router>
    </div>
  )
}
export default App