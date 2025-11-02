"use client"

import { useState } from "react"
import { FaStar, FaEdit, FaTrash, FaUser } from "react-icons/fa"
import "./ReviewList.css"
import { showConfirmToast } from "../../utils/toasts/confirmToast"

const ReviewList = ({
  reviews = [],
  currentUser = null,
  onEditReview = null,
  onDeleteReview = null,
  showAirlineInfo = true,
}) => {
  const [expandedReviews, setExpandedReviews] = useState(new Set())

  const toggleExpanded = (reviewId) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar key={star} className={`star ${star <= rating ? "filled" : ""}`} />
        ))}
      </div>
    )
  }

  const canEditReview = (review) => {
    return currentUser && currentUser.id === review.userId
  }

  const handleEdit = (review) => {
    if (onEditReview) {
      onEditReview(review)
    }
  }

  const handleDelete = async (reviewId) => {
    showConfirmToast("¿Estás seguro de que quieres eliminar esta reseña?", async () => {
      if (onDeleteReview) {
        await onDeleteReview(reviewId)
      }
    })
  }

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No hay reseñas disponibles aún.</p>
        <p>¡Sé el primero en compartir tu experiencia!</p>
      </div>
    )
  }

  return (
    <div className="review-list">
      <h3>Reseñas de Usuarios</h3>

      <div className="reviews-container">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id)
          const isLongComment = review.comment.length > 150
          const displayComment =
            isExpanded || !isLongComment ? review.comment : `${review.comment.substring(0, 150)}...`

          return (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {review.user?.profilePicture ? (
                      <img
                        src={`http://localhost:3000/uploads/profile-pictures/${review.user.profilePicture}`}
                        alt={review.user.name}
                        className="profile-picture"
                      />
                    ) : (
                      <FaUser className="default-avatar" />
                    )}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{review.user?.name || "Usuario"}</span>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>

                {showAirlineInfo && (
                  <div className="airline-info">
                    <span className="airline-name">{review.airline}</span>
                  </div>
                )}

                {canEditReview(review) && (
                  <div className="review-actions">
                    <button onClick={() => handleEdit(review)} className="edit-button" title="Editar reseña">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="delete-button" title="Eliminar reseña">
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              <div className="review-content">
                <div className="rating-section">
                  {renderStars(review.rating)}
                  <span className="rating-number">{review.rating}/5</span>
                </div>

                <div className="comment-section">
                  <p className="comment-text">{displayComment}</p>
                  {isLongComment && (
                    <button onClick={() => toggleExpanded(review.id)} className="expand-button">
                      {isExpanded ? "Ver menos" : "Ver más"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReviewList
