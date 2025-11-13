import { useState, useEffect } from "react"
import { FaStar } from "react-icons/fa"
import "./ReviewForm.css"
import { showConfirmToast } from "../../utils/toasts/confirmToast"

const ReviewForm = ({ onReviewSubmit, existingReview = null, airlines = [] }) => {
  const [formData, setFormData] = useState({
    airline: existingReview?.airline || "",
    rating: existingReview?.rating || 0,
    comment: existingReview?.comment || "",
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Actualizar formulario si cambia la reseña existente
  useEffect(() => {
    if (existingReview) {
      setFormData({
        airline: existingReview.airline,
        rating: existingReview.rating,
        comment: existingReview.comment,
      })
    }
  }, [existingReview])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleStarClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones
    if (!formData.airline) {
      setError("Por favor selecciona una aerolínea")
      return
    }
    if (formData.rating === 0) {
      setError("Por favor selecciona una calificación")
      return
    }
    if (!formData.comment.trim()) {
      setError("Por favor escribe un comentario")
      return
    }

    // Mensaje dinámico según acción
    const confirmMessage = existingReview ? "¿Está seguro de que quiere modificar su reseña?" : "¿Está seguro de que quiere publicar esta reseña?"

    showConfirmToast( confirmMessage, async () => {
      setIsSubmitting(true)
      setError("")

      try {
        await onReviewSubmit(formData)

        // Limpiar formulario solo si no es edición
        if (!existingReview) {
          setFormData({
            airline: "",
            rating: 0,
            comment: "",
          })
        }
      } catch (error) {
        setError(error.message || "Error al enviar la reseña")
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className="review-form-container">
      <h3>{existingReview ? "Editar Reseña" : "Escribir Reseña"}</h3>

      <form onSubmit={handleSubmit} className="review-form">
        {/* Selector de aerolínea */}
        <div className="form-group">
          <label htmlFor="airline">Aerolínea</label>
          <select
            id="airline"
            name="airline"
            value={formData.airline}
            onChange={handleInputChange}
            disabled={existingReview} // No permitir cambiar aerolínea en edición
            required
          >
            <option value="">Selecciona una aerolínea</option>
            {airlines.map((airline) => (
              <option key={airline} value={airline}>
                {airline}
              </option>
            ))}
          </select>
        </div>

        {/* Calificación con estrellas */}
        <div className="form-group">
          <label>Calificación</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`star ${star <= (hoveredRating || formData.rating) ? "active" : ""}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
            <span className="rating-text">{formData.rating > 0 && `${formData.rating} de 5 estrellas`}</span>
          </div>
        </div>

        {/* Comentario */}
        <div className="form-group">
          <label htmlFor="comment">Comentario</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Comparte tu experiencia con esta aerolínea..."
            rows="4"
            required
          />
        </div>

        {/* Error */}
        {error && <div className="error-message">{error}</div>}

        {/* Botón de envío */}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : existingReview ? "Actualizar Reseña" : "Enviar Reseña"}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
