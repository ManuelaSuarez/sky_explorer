import { useState } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaPlane, FaDownload } from "react-icons/fa"
import jsPDF from 'jspdf'
import { toast } from "react-toastify"
import ValidationsCheckout from "../../components/ValidationsCheckout/ValidationsCheckout"
import "./Checkout.css"

const Checkout = () => {
  // Recupera el vuelo elegido y la cantidad de pasajeros pasados por navigate
  const { state } = useLocation()
  const { flight, passengers, departureDate, returnDate } = state || {}
  const navigate = useNavigate()

  // Estado para los datos del form según cuántos pasajeros son
  const [formData, setFormData] = useState(
    Array.from({ length: passengers }, () => ({
      nombre: "",
      apellido: "",
      nacionalidad: "",
      dni: "",
      fechaNacimiento: "",
      email: "",
    }))
  )

  const [errores, setErrores] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingCompleted, setBookingCompleted] = useState(false)
  const [savedBookingData, setSavedBookingData] = useState(null)

  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

  // Función para generar el PDF del ticket
  const generateTicketPDF = (bookingData) => {
    // DEBUG: Ver qué datos tenemos
    console.log("=== DEBUG PDF ===")
    console.log("flight object:", flight)
    console.log("flight.date:", flight?.date)
    console.log("flight.departureDate:", flight?.departureDate)
    console.log("departureDate from state:", departureDate)
    console.log("returnDate from state:", returnDate)
    console.log("=================")
    
    const doc = new jsPDF()
    
    // Configuración de colores y fuentes
    const primaryColor = [41, 128, 185]
    const secondaryColor = [52, 73, 94]
    const accentColor = [231, 76, 60]
    
    // Header
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("TICKET DE VUELO", 105, 25, { align: "center" })
    
    // Información del vuelo
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("DETALLES DEL VUELO", 20, 60)
    
    // Línea divisoria
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(1)
    doc.line(20, 65, 190, 65)
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    
    let yPos = 80
    
    // Información del vuelo en dos columnas
    doc.setFont("helvetica", "bold")
    doc.text("Origen:", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(flight?.departureAirport || "N/A", 60, yPos)
    
    doc.setFont("helvetica", "bold")
    doc.text("Destino:", 110, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(flight?.arrivalAirport || "N/A", 150, yPos)
    
    yPos += 15
    doc.setFont("helvetica", "bold")
    doc.text("Fecha Ida:", 20, yPos)
    doc.setFont("helvetica", "normal")
    // Usar múltiples fallbacks para obtener la fecha
    const fechaIda = flight?.date || flight?.departureDate || departureDate || "N/A"
    doc.text(fechaIda, 60, yPos)
    
    doc.setFont("helvetica", "bold")
    doc.text("Aerolínea:", 110, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(flight?.airline || "N/A", 150, yPos)
    
    yPos += 15
    // Mostrar fecha de vuelta si la búsqueda era ida y vuelta
    if (returnDate) {
      doc.setFont("helvetica", "bold")
      doc.text("Fecha Vuelta:", 20, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(returnDate, 60, yPos)
      yPos += 15
    }
    
    doc.setFont("helvetica", "bold")
    doc.text("Salida Ida:", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(flight?.departureTime || "N/A", 70, yPos)
    
    doc.setFont("helvetica", "bold")
    doc.text("Llegada Ida:", 110, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(flight?.arrivalTime || "N/A", 165, yPos)
    
    // Si es ida y vuelta, mostrar horarios de vuelta (usando los mismos horarios)
    if (returnDate) {
      yPos += 15
      doc.setFont("helvetica", "bold")
      doc.text("Salida Vuelta:", 20, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(flight?.departureTime || "N/A", 70, yPos)
      
      doc.setFont("helvetica", "bold")
      doc.text("Llegada Vuelta:", 110, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(flight?.arrivalTime || "N/A", 165, yPos)
      
      yPos += 10
      doc.setFont("helvetica", "italic")
      doc.setFontSize(10)
      doc.text("* Horarios estimados. Confirmar con aerolínea.", 20, yPos)
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
    }
    
    // Información de pasajeros (más compacta)
    yPos += 20
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("PASAJEROS", 20, yPos)
    
    doc.setDrawColor(...primaryColor)
    doc.line(20, yPos + 5, 190, yPos + 5)
    
    yPos += 15
    doc.setFontSize(12)
    
    formData.forEach((passenger, index) => {
      doc.setFont("helvetica", "bold")
      doc.text(`Pasajero ${index + 1}: ${passenger.nombre} ${passenger.apellido}`, 20, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(`DNI: ${passenger.dni} | ${passenger.nacionalidad} | ${passenger.email}`, 20, yPos + 8)
      yPos += 18
    })
    
    // Información de pago
    yPos += 10
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("RESUMEN DE PAGO", 20, yPos)
    
    doc.setDrawColor(...primaryColor)
    doc.line(20, yPos + 5, 190, yPos + 5)
    
    yPos += 20
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    
    const totalBase = flight?.originalPrice * passengers
    const taxes = totalBase * 0.2
    const totalFinal = totalBase + taxes
    
    doc.text(`Precio por persona: $${flight?.originalPrice.toLocaleString()}`, 20, yPos)
    doc.text(`Cantidad de pasajeros: ${passengers}`, 20, yPos + 10)
    doc.text(`Subtotal: $${totalBase?.toLocaleString()}`, 20, yPos + 20)
    doc.text(`Impuestos (20%): $${taxes?.toLocaleString()}`, 20, yPos + 30)
    
    // Total destacado con mejor diseño
    doc.setFillColor(...accentColor)
    doc.rect(15, yPos + 40, 180, 20, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text(`TOTAL: ${totalFinal?.toLocaleString()}`, 105, yPos + 53, { align: "center" })
    
    // Espaciado adicional antes del footer
    yPos += 80
    
    // Footer mejorado con más estilo
    doc.setTextColor(128, 128, 128)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text("Gracias por volar con nosotros", 105, yPos, { align: "center" })
    
    yPos += 15
    doc.setFontSize(10)
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 105, yPos, { align: "center" })
    
    yPos += 10
    // Código de reserva (simulado)
    const bookingCode = `${flight?.airline?.substring(0, 2).toUpperCase() || 'FL'}${Date.now().toString().slice(-6)}`
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(52, 73, 94)
    doc.text(`Código de reserva: ${bookingCode}`, 105, yPos, { align: "center" })
    
    // Línea decorativa final
    yPos += 15
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(60, yPos, 150, yPos)
    
    yPos += 10
    doc.setTextColor(100, 100, 100)
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.text("Este ticket es válido únicamente con documento de identidad", 105, yPos, { align: "center" })
    
    yPos += 8
    doc.text("Conserve este comprobante para futuras consultas", 105, yPos, { align: "center" })
    
    // Guardar el PDF
    const fileName = `ticket-${bookingCode}-${new Date().getTime()}.pdf`
    doc.save(fileName)
  }

  // Maneja cambios en el formulario
  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updated = [...formData]
    updated[index][name] = value
    setFormData(updated)
  }

  // Función para guardar la reserva en el backend
  const saveBookingToBackend = async (bookingData) => {
    try {
      // token para asociar la reserva al usuario
      const token = getAuthToken()

      if (!token) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.")
      }

      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Sesión expirada. Por favor, inicia sesión nuevamente."
          )
        }
        throw new Error("Error al guardar la reserva")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error al comunicarse con el servidor:", error)
      throw error
    }
  }

  // Gestiona el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    const erroresValidados = ValidationsCheckout(formData)
    setErrores(erroresValidados)

    const tieneErrores = erroresValidados.some(
      (error) => Object.keys(error).length > 0
    )

    if (!tieneErrores) {
      try {
        // Verificar que el usuario esté autenticado
        const token = getAuthToken()
        if (!token) {
          toast.info("Debes iniciar sesión para realizar la compra.")
          navigate("/login")
          return
        }

        // Calcular el precio total
        const totalBase = flight?.originalPrice * passengers
        const taxes = totalBase * 0.2
        const totalFinal = totalBase + taxes

        // Preparar datos para enviar al backend (sin userId, se obtiene del token)
        const bookingData = {
          flightId: flight.id,
          passengers: formData,
          totalPrice: totalFinal,
        }

        // Guardar en el backend
        const savedBooking = await saveBookingToBackend(bookingData)
        
        // Guardar datos para mostrar después
        setSavedBookingData({
          ...bookingData,
          bookingId: savedBooking.id,
          bookingCode: `${flight?.airline?.substring(0, 2).toUpperCase() || 'FL'}${Date.now().toString().slice(-6)}`
        })
        
        setBookingCompleted(true)
        
        toast.success("¡Compra realizada con éxito! Ahora puedes descargar tu ticket.")

        console.log("Reserva guardada:", savedBooking)

      } catch (error) {
        if (
          error.message.includes("autenticado") ||
          error.message.includes("Sesión expirada")
        ) {
          toast.error(error.message)
          navigate("/login")
        } else {
          toast.error(
            "Hubo un error al procesar tu compra. Por favor, intenta nuevamente."
          )
        }
        console.error("Error en la compra:", error)
      }
    }

    setIsProcessing(false)
  }

  // Función para manejar la descarga del PDF
  const handleDownloadPDF = () => {
    generateTicketPDF(savedBookingData)
  }

  // Función para continuar al panel de vuelos
  const handleContinueToPanel = () => {
    navigate("/flights-panel")
  }

  // Calcular los valores del resumen de pago
  const totalBase = flight?.originalPrice * passengers
  const taxes = totalBase * 0.2
  const totalFinal = totalBase + taxes

  // Si la compra está completada, mostrar la pantalla de éxito
  if (bookingCompleted) {
    return (
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="success-message">
            <h1 className="success-title">¡Compra realizada con éxito! ✈️</h1>
            <p className="success-subtitle">
              Tu reserva ha sido confirmada. Código de reserva: <strong>{savedBookingData?.bookingCode}</strong>
            </p>
            
            <div className="success-actions">
              <button 
                className="download-pdf-button" 
                onClick={handleDownloadPDF}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  margin: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaDownload /> Descargar Ticket PDF
              </button>
              
              <button 
                className="continue-button" 
                onClick={handleContinueToPanel}
                style={{
                  backgroundColor: '#2980b9',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  margin: '10px'
                }}
              >
                Ir a Mis Vuelos
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
                  <div className="date-label">FECHA IDA</div>
                  <div className="date-value">{flight?.date || flight?.departureDate || departureDate || "N/A"}</div>
                  <div className="time-value">
                    {flight?.departureTime || "N/A"} - {flight?.arrivalTime || "N/A"}
                  </div>
                  {returnDate && (
                    <>
                      <div className="date-label" style={{marginTop: '10px'}}>FECHA VUELTA</div>
                      <div className="date-value">{returnDate}</div>
                      <div className="time-value">
                        {flight?.departureTime || "N/A"} - {flight?.arrivalTime || "N/A"} (estimado)
                      </div>
                    </>
                  )}
                </div>
                <div className="airline-name">{flight?.airline}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout