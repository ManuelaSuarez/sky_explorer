import { useState, useEffect } from "react"
import { FaStar } from "react-icons/fa"
import "./AirlineRating.css"

const AirlineRating = ({ airline }) => {
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    totalReviews: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAirlineRating = async () => {
      if (!airline) return

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:3000/api/reviews/airline/${encodeURIComponent(airline)}/average`)

        if (!response.ok) {
          throw new Error("Error al cargar la calificación")
        }

        const data = await response.json()
        setRatingData(data)
        setError(null)
      } catch (error) {
        console.error("Error al obtener calificación:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAirlineRating()
  }, [airline])

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="stars">
        {/* Estrellas llenas */}
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <FaStar key={`full-${i}`} className="star filled" />
          ))}

        {/* Media estrella */}
        {hasHalfStar && (
          <div className="star-container">
            <FaStar className="star empty" />
            <FaStar className="star half-filled" />
          </div>
        )}

        {/* Estrellas vacías */}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <FaStar key={`empty-${i}`} className="star empty" />
          ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="airline-rating loading">
        <div className="rating-skeleton">
          <div className="skeleton-stars"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="airline-rating error">
        <span className="error-text">Error al cargar calificación</span>
      </div>
    )
  }

  if (ratingData.totalReviews === 0) {
    return (
      <div className="airline-rating no-reviews">
        <span className="no-reviews-text">Sin reseñas aún</span>
      </div>
    )
  }

  return (
    <div className="airline-rating">
      <div className="rating-display">
        {renderStars(ratingData.averageRating)}
        <span className="rating-number">{ratingData.averageRating.toFixed(1)}</span>
        <span className="review-count">
          ({ratingData.totalReviews} {ratingData.totalReviews === 1 ? "reseña" : "reseñas"})
        </span>
      </div>
    </div>
  )
}

export default AirlineRating
