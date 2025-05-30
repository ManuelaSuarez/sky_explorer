import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlane } from "react-icons/fa";
import Validations from "../../components/Validations/Validations.jsx";
import "./Checkout.css";

const Checkout = () => {
  // Recuperar los datos pasados por navigate
  const { state } = useLocation();
  const { flight, passengers } = state || {};
  const navigate = useNavigate();

  // Estados existentes
  const [formData, setFormData] = useState(
    Array.from({ length: passengers }, () => ({
      nombre: "",
      apellido: "",
      nacionalidad: "",
      dni: "",
      fechaNacimiento: "",
      email: "",
    }))
  );

  const [errores, setErrores] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Función para obtener el token del usuario
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Asume que guardas el token en localStorage
  };

  // Manejador que actualiza el valor de un campo específico de un pasajero
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData];
    updated[index][name] = value;
    setFormData(updated);
  };

  // Función para guardar la reserva en el backend con autenticación
  const saveBookingToBackend = async (bookingData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
      }

      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Incluir el token en los headers
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        throw new Error("Error al guardar la reserva");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error al comunicarse con el servidor:", error);
      throw error;
    }
  };

  // Validamos todos los formularios al enviar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const erroresValidados = Validations(formData);
    setErrores(erroresValidados);

    const tieneErrores = erroresValidados.some(
      (error) => Object.keys(error).length > 0
    );

    if (!tieneErrores) {
      try {
        // Verificar que el usuario esté autenticado
        const token = getAuthToken();
        if (!token) {
          alert("Debes iniciar sesión para realizar la compra.");
          navigate("/login"); // Redirigir al login
          return;
        }

        // Calcular el precio total
        const totalBase = flight?.originalPrice * passengers;
        const taxes = totalBase * 0.2;
        const totalFinal = totalBase + taxes;

        // Preparar datos para enviar al backend (sin userId, se obtiene del token)
        const bookingData = {
          flightId: flight.id,
          passengers: formData,
          totalPrice: totalFinal,
          // Removemos userId porque se obtiene del token en el backend
        };

        // Guardar en el backend
        const savedBooking = await saveBookingToBackend(bookingData);

        alert("¡Compra realizada con éxito!");
        
        console.log("Reserva guardada:", savedBooking);

        // Redirigir al panel de vuelos o a una página de confirmación
        navigate("/flights-panel");

      } catch (error) {
        if (error.message.includes("autenticado") || error.message.includes("Sesión expirada")) {
          alert(error.message);
          navigate("/login");
        } else {
          alert("Hubo un error al procesar tu compra. Por favor, intenta nuevamente.");
        }
        console.error("Error en la compra:", error);
      }
    }

    setIsProcessing(false);
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
                  />
                  {errores[i]?.email && (
                    <div className="error">{errores[i].email}</div>
                  )}
                </div>
              </div>
            ))}

            <button 
              type="submit" 
              className="buy-button" 
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : "Comprar"}
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