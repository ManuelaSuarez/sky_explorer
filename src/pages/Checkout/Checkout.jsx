"use client";

import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaArrowLeft, FaPlane } from "react-icons/fa";
import Validations from "../../components/Validations/Validations.jsx";
import "./Checkout.css";

const Checkout = () => {
  // Recuperar los datos pasados por navigate
  const { state } = useLocation();
  const { flight, passengers } = state || {};

  // Plantilla de un pasajero vacío para clonar múltiples formularios
  const initialPassenger = {
    nombre: "",
    apellido: "",
    nacionalidad: "",
    dni: "",
    fechaNacimiento: "",
    email: "",
  };

  // Array con tantos formularios como pasajeros seleccionados
  const [formData, setFormData] = useState(
    Array.from({ length: passengers }, () => ({ ...initialPassenger }))
  );

  // Estado para guardar errores por cada pasajero
  const [errores, setErrores] = useState([]);

  // Manejador que actualiza el valor de un campo específico de un pasajero
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData];
    updated[index][name] = value;
    setFormData(updated);
  };

  // Validamos todos los formularios al enviar
  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidados = Validations(formData);
    setErrores(erroresValidados);

    const tieneErrores = erroresValidados.some(
      (error) => Object.keys(error).length > 0
    );
    if (!tieneErrores) {
      alert("Compra realizada con éxito");
      console.log("Formulario:", formData);
    }
  };

  // Calcular los valores del resumen de pago
  const totalBase = flight?.originalPrice * passengers;
  const taxes = totalBase * 0.2;
  const totalFinal = totalBase + taxes;

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
            {formData.map((p, i) => (
              <div className="passenger-info-form" key={i}>
                <div className="form-header">
                  <div className="passenger-count">Pasajero {i + 1}</div>
                </div>

                <div className="form-label">Nombre</div>
                <div className="form-group">
                  <input
                    type="text"
                    name="nombre"
                    value={p.nombre}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="Nombre"
                    required
                  />
                  {errores[i]?.nombre && (
                    <div className="error">{errores[i].nombre}</div>
                  )}
                </div>

                <div className="form-label">Apellido</div>
                <div className="form-group">
                  <input
                    type="text"
                    name="apellido"
                    value={p.apellido}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="Apellido"
                    required
                  />
                  {errores[i]?.apellido && (
                    <div className="error">{errores[i].apellido}</div>
                  )}
                </div>

                <div className="form-label">Nacionalidad</div>
                <div className="form-group">
                  <input
                    type="text"
                    name="nacionalidad"
                    value={p.nacionalidad}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="Nacionalidad"
                    required
                  />
                  {errores[i]?.nacionalidad && (
                    <div className="error">{errores[i].nacionalidad}</div>
                  )}
                </div>

                <div className="form-label">DNI</div>
                <div className="form-group">
                  <input
                    type="text"
                    name="dni"
                    value={p.dni}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="00000000"
                    required
                  />
                  {errores[i]?.dni && (
                    <div className="error">{errores[i].dni}</div>
                  )}
                </div>

                <div className="form-label">Fecha de nacimiento</div>
                <div className="form-group">
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={p.fechaNacimiento}
                    onChange={(e) => handleChange(i, e)}
                    required
                  />
                  {errores[i]?.fechaNacimiento && (
                    <div className="error">{errores[i].fechaNacimiento}</div>
                  )}
                </div>

                <div className="form-label">Email</div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={p.email}
                    onChange={(e) => handleChange(i, e)}
                    placeholder="ejemplo@gmail.com"
                    required
                  />
                  {errores[i]?.email && (
                    <div className="error">{errores[i].email}</div>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" className="buy-button" onClick={handleSubmit}>
              Comprar
            </button>
          </div>

          <div className="checkout-sidebar">
            <div className="info-card payment-details">
              <h2 className="card-title">Detalles del pago</h2>
              <div className="detail-row">
                <span>Precio por persona</span>
                <span className="price">
                  $ {flight?.originalPrice.toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span>Pasajeros</span>
                <span className="price">{passengers}</span>
              </div>
              <div className="detail-row">
                <span>Subtotal</span>
                <span className="price">$ {totalBase?.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Impuestos (20%)</span>
                <span className="price">$ {taxes?.toLocaleString()}</span>
              </div>
              <div className="divider"></div>
              <div className="detail-row total">
                <span>Total</span>
                <span className="price">$ {totalFinal?.toLocaleString()}</span>
              </div>
            </div>

            <div className="info-card flight-details">
              <div className="flight-details-title">
                Detalles del vuelo
                <div className="flight-plane-icon">
                  <FaPlane />
                </div>
                <div className="route-line">
                  <strong>{flight?.departureAirport}</strong> -{" "}
                  <strong>{flight?.arrivalAirport}</strong>
                </div>
                <div className="flight-date-column">
                  <div className="date-label">FECHA</div>
                  <div className="date-value">{flight?.date}</div>
                  <div className="time-value">
                    {flight?.departureTime} - {flight?.arrivalTime}
                  </div>
                </div>
                <div className="airline-name">{flight?.airline}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
