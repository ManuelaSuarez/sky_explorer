"use client"
import { useState } from "react"
import { FaPlane, FaUserCog } from "react-icons/fa"
import FlightManagement from "../FlightManagement/FlightManagement"
import AccountManagement from "../AccountManagement/AccountManagement"
import "./AdminPanel.css"

const AdminPanel = () => {
  // Estado simple para controlar la sección activa
  const [activeSection, setActiveSection] = useState("flights") // Valor por defecto

  return (
    <div className="admin-panel-container">
      {/* Pestañas */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeSection === "flights" ? "active-tab" : ""}`}
          onClick={() => setActiveSection("flights")}
        >
          <FaPlane /> Vuelos
        </button>
        <button
          className={`admin-tab ${activeSection === "accounts" ? "active-tab" : ""}`}
          onClick={() => setActiveSection("accounts")}
        >
          <FaUserCog /> Cuentas
        </button>
      </div>

      {/* Contenido */}
      {activeSection === "flights" && <FlightManagement />}
      {activeSection === "accounts" && <AccountManagement />}
    </div>
  )
}

export default AdminPanel