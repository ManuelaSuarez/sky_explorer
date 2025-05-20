"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaPlane, FaUserCog } from "react-icons/fa"
import FlightManagement from "../FlightManagement/FlightManagement"
import AccountManagement from "../AccountManagement/AccountManagement"
import "./AdminPanel.css"

const AdminPanel = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Obtener la sección de la URL (si existe)
  const queryParams = new URLSearchParams(location.search)
  const sectionParam = queryParams.get("section")

  // Estado para controlar qué sección se muestra
  const [activeSection, setActiveSection] = useState(sectionParam === "accounts" ? "accounts" : "flights")

  // Actualizar la sección activa cuando cambia la URL
  useEffect(() => {
    if (sectionParam === "accounts") {
      setActiveSection("accounts")
    } else if (sectionParam === "flights" || !sectionParam) {
      setActiveSection("flights")
    }
  }, [sectionParam])

  // Cambiar sección y actualizar URL
  const handleSectionChange = (section) => {
    setActiveSection(section)
    navigate(`/admin${section === "accounts" ? "?section=accounts" : ""}`)
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeSection === "flights" ? "active-tab" : ""}`}
          onClick={() => handleSectionChange("flights")}
        >
          <FaPlane /> Vuelos
        </button>
        <button
          className={`admin-tab ${activeSection === "accounts" ? "active-tab" : ""}`}
          onClick={() => handleSectionChange("accounts")}
        >
          <FaUserCog /> Cuentas
        </button>
      </div>

      {activeSection === "flights" && <FlightManagement />}
      {activeSection === "accounts" && <AccountManagement />}
    </div>
  )
}

export default AdminPanel
