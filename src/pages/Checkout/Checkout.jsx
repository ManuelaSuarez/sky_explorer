"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowLeft, FaPlane } from "react-icons/fa"
import "./Checkout.css"

const Checkout = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nacionalidad: "Argentina",
    dni: "",
    fechaNacimiento: "",
    sexo: "Masculino",
    clase: "Economica",
    email: "",
    confirmarEmail: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para procesar la compra
    console.log("Datos del formulario:", formData)
    alert("¡Compra realizada con éxito!")
  }

  // Datos de ejemplo para el vuelo y el pago
  const flightDetails = {
    origin: "Buenos Aires (BUE)",
    destination: "Rosario",
    returnOrigin: "Rosario",
    returnDestination: "Buenos Aires (BUE)",
    departureDate: "02 Oct. 2024",
    departureTime: "06:50 - 07:50",
    returnDate: "09 Oct. 2024",
    returnTime: "16:50 - 17:50",
    airline: "Aerolineas Argentinas",
  }

  const paymentDetails = {
    flightCost: 85130,
    classSurcharge: 32700,
    taxes: 8250,
    total: 126080,
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="back-link">
          <Link to="/flights">
            <FaArrowLeft /> Volver a la pagina anterior
          </Link>
        </div>

        <h1 className="checkout-title">
          Ya casi conseguís el vuelo de tus sueños!
          <br />
          <span className="checkout-subtitle">Completá los datos y listo!</span>
        </h1>

        <div className="checkout-main">
          <div className="checkout-form-section">
            <div className="passenger-info-form">
              <div className="form-header">
                <div className="passenger-count">1 Adulto</div>
              </div>

              <div className="form-label">Nombre</div>
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </div>

              <div className="form-label">Apellido</div>
              <div className="form-group">
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                />
              </div>

              <div className="form-label">Nacionalidad</div>
              <div className="form-group">
                <input
                  type="text"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  placeholder="Argentina"
                  required
                />
              </div>

              <div className="form-label">DNI (Documento Nacional de Identidad)</div>
              <div className="form-group">
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="00000000"
                  required
                />
              </div>

              <div className="form-label">Fecha de nacimiento</div>
              <div className="form-group">
                <input
                  type="text"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  placeholder="DD/MM/AAAA"
                  required
                />
              </div>

              <div className="form-label">Sexo</div>
              <div className="option-buttons gender-buttons">
                <button
                  type="button"
                  className={formData.sexo === "Masculino" ? "option-selected" : ""}
                  onClick={() => setFormData({ ...formData, sexo: "Masculino" })}
                >
                  Masculino
                </button>
                <div className="option-divider"></div>
                <button
                  type="button"
                  className={formData.sexo === "Femenino" ? "option-selected" : ""}
                  onClick={() => setFormData({ ...formData, sexo: "Femenino" })}
                >
                  Femenino
                </button>
              </div>

              <div className="form-label">Clase</div>
              <div className="option-buttons class-buttons">
                <button
                  type="button"
                  className={formData.clase === "Economica" ? "option-selected" : ""}
                  onClick={() => setFormData({ ...formData, clase: "Economica" })}
                >
                  Economica
                </button>
                <div className="option-divider"></div>
                <button
                  type="button"
                  className={formData.clase === "Primera clase" ? "option-selected" : ""}
                  onClick={() => setFormData({ ...formData, clase: "Primera clase" })}
                >
                  Primera clase
                </button>
              </div>
            </div>

            <div className="voucher-section-title">A donde enviamos tu(s) voucher?</div>

            <div className="voucher-section">
              <div className="form-label">Email</div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@gmail.com"
                  required
                />
              </div>

              <div className="form-label">Confirma tu email</div>
              <div className="form-group">
                <input
                  type="email"
                  name="confirmarEmail"
                  value={formData.confirmarEmail}
                  onChange={handleChange}
                  placeholder="ejemplo@gmail.com"
                  required
                />
              </div>
            </div>

            <button type="submit" className="buy-button" onClick={handleSubmit}>
              Comprar
            </button>
          </div>

          <div className="checkout-sidebar">
            <div className="info-card payment-details">
              <h2 className="card-title">Detalles del pago</h2>

              <div className="detail-row">
                <span>Vuelo(s) para n persona(s)</span>
                <span className="price">$ {paymentDetails.flightCost.toLocaleString()}</span>
              </div>

              <div className="detail-row">
                <span>Recargo por clase n</span>
                <span className="price">$ {paymentDetails.classSurcharge.toLocaleString()}</span>
              </div>

              <div className="detail-row">
                <span>Impuestos</span>
                <span className="price">$ {paymentDetails.taxes.toLocaleString()}</span>
              </div>

              <div className="divider"></div>

              <div className="detail-row total">
                <span>TOTAL</span>
                <span className="price">$ {paymentDetails.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Diseño exacto para los detalles del vuelo como en la segunda imagen */}
            <div className="info-card flight-details">
              <div className="flight-details-title">Detalles del vuelo
                <div className="flight-plane-icon">
                <FaPlane />
              </div>
               <div className="route-line">
                   <strong>{flightDetails.origin}</strong> - <strong>{flightDetails.destination}</strong>
                   <div className="route-line">
                  <strong>{flightDetails.returnOrigin}</strong> - <strong>{flightDetails.returnDestination}</strong>
                </div>
                
                 <div className="flight-date-column">
                  <div className="date-label">IDA</div>
                  <div className="date-value">{flightDetails.departureDate}</div>
                  <div className="time-value">{flightDetails.departureTime}</div>
                </div>
                <div className="flight-date-column-2">
                  <div className="date-label">VUELTA</div>
                  <div className="date-value">{flightDetails.returnDate}</div>
                  <div className="time-value">{flightDetails.returnTime}</div>
                </div>
                <div className="airline-name">{flightDetails.airline}</div>
              </div>
              
              </div>
             
              </div>
              
            </div>
          </div>
        </div>
      </div>
  
  )
}

export default Checkout