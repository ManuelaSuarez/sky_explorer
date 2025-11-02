import { useState, useEffect, useRef } from "react"
import "./UserProfileModal.css"
import { showConfirmToast } from "../../utils/toasts/confirmToast"

const UserProfileModal = ({ user, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || null,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  const [errors, setErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [isImageDeleted, setIsImageDeleted] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || null,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      })
      setProfileImageFile(null)
      setProfileImagePreview(null)
      setIsImageDeleted(false)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prevErrors => ({ ...prevErrors, profilePicture: "La imagen es demasiado grande (máximo 5 MB)." }))
        return
      }
      setErrors(prevErrors => ({ ...prevErrors, profilePicture: "" }))
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      // Al subir una nueva imagen, se desactiva el estado de "eliminado"
      setIsImageDeleted(false)
    } else {
      setProfileImageFile(null)
      setProfileImagePreview(null)
      // Al cancelar la selección de archivo, no se debe eliminar la imagen actual
    }
  }
  
  const handleDeleteImage = () => {
    setProfileImageFile(null)
    setProfileImagePreview(null)
    setFormData(prev => ({ ...prev, profilePicture: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // Establecer el estado de "eliminado" en true para ocultar la imagen anterior
    setIsImageDeleted(true)
  }

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido"
    }

    if (isEditing && formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Debe ingresar su contraseña actual para cambiarla."
      }
      if (formData.newPassword.length < 7) {
        newErrors.newPassword = "La nueva contraseña debe tener al menos 7 caracteres"
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Las nuevas contraseñas no coinciden"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm() || errors.profilePicture) return

    showConfirmToast("¿Deseas guardar los cambios en tu perfil?", async () => {
      setIsSubmitting(true)

      try {
        const data = new FormData()
        data.append("name", formData.name)
        data.append("email", formData.email)

        if (profileImageFile) {
          data.append("profilePicture", profileImageFile)
        } else if (isImageDeleted && user.profilePicture) {
          // La foto se eliminó en la previsualización, así que se le indica al backend que la elimine.
          data.append("profilePicture", "delete")
        }

        if (formData.newPassword) {
          data.append("currentPassword", formData.currentPassword)
          data.append("newPassword", formData.newPassword)
        }

        await onUpdate(data)
        setIsEditing(false)
        setProfileImageFile(null)
        setProfileImagePreview(null)
        // Restablecer el estado de "eliminado" tras guardar
        setIsImageDeleted(false)

        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        }))
      } catch (error) {
        setErrors({ ...errors, general: error.message || "Error al actualizar el perfil" })
      } finally {
        setIsSubmitting(false)
      }
    })
  } 

  const handleConfirmDelete = () => {
    showConfirmToast(
      "¿Estás completamente seguro? Esta acción no se puede deshacer y se eliminarán todas tus reservas.",
      async () => {
        setIsSubmitting(true)
        try {
          await onDelete()
        } catch (error) {
          setErrors({ ...errors, general: error.message || "Error al eliminar la cuenta" })
        } finally {
          setIsSubmitting(false)
        }
      },
    )
  }
  
  const currentProfilePicture = profileImagePreview ||
    (!isImageDeleted && user?.profilePicture
      ? `http://localhost:3000/uploads/profile-pictures/${user.profilePicture}`
      : null)

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>Mi Perfil</h2>

        {errors.general && <p className="profile-error-message">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <div className="profile-form-group profile-picture-group">
            <label>Foto de Perfil</label>
            <div className="profile-picture-container">
              {/* Contenedor de la imagen circular o el placeholder */}
              <div className="profile-picture-circle">
                {currentProfilePicture ? (
                  <img
                    src={currentProfilePicture || "/placeholder.svg"}
                    alt="Previsualización de perfil"
                    className="profile-picture-preview-circle"
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="profile-placeholder-circle">
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <>
                  {/* Campo de entrada de archivo oculto */}
                  <input
                    type="file"
                    id="profile-picture-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />

                  {/* Acciones para cambiar y eliminar la foto */}
                  <div className="profile-picture-actions-overlay">
                    <label htmlFor="profile-picture-upload" className="change-photo-btn" title="Cambiar foto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-camera"
                      >
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5L14.5 4z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </label>
                    {(profileImagePreview || user?.profilePicture) && !isImageDeleted && (
                      <button
                        type="button"
                        className="delete-photo-btn"
                        onClick={handleDeleteImage}
                        title="Eliminar foto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </button>
                    )}
                  </div>
                </>
              )}
              {errors.profilePicture && <span className="profile-error">{errors.profilePicture}</span>}
            </div>
          </div>

          <div className="profile-form-group">
            <label>Nombre</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
            {errors.name && <span className="profile-error">{errors.name}</span>}
          </div>

          <div className="profile-form-group">
            <label>Correo electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
            {errors.email && <span className="profile-error">{errors.email}</span>}
          </div>

          {isEditing && (
            <>
              <div className="profile-form-group">
                <label>Contraseña actual (para cambios)</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Solo necesaria para cambiar contraseña"
                />
                {errors.currentPassword && <span className="profile-error">{errors.currentPassword}</span>}
              </div>

              <div className="profile-form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para no cambiar"
                />
                {errors.newPassword && <span className="profile-error">{errors.newPassword}</span>}
              </div>

              {formData.newPassword && (
                <div className="profile-form-group">
                  <label>Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmNewPassword && <span className="profile-error">{errors.confirmNewPassword}</span>}
                </div>
              )}
            </>
          )}

          <div className="profile-modal-actions">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: user.name,
                      email: user.email,
                      profilePicture: user.profilePicture,
                      currentPassword: "",
                      newPassword: "",
                      confirmNewPassword: ""
                    })
                    setProfileImageFile(null)
                    setProfileImagePreview(null)
                    setErrors({})
                    setIsImageDeleted(false)
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button type="submit" className="profile-save-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </button>
                <button type="button" className="profile-delete-btn" onClick={handleConfirmDelete}>
                  Eliminar Cuenta
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfileModal