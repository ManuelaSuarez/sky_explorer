import { useState, useEffect } from "react";
import "./UserProfileModal.css";

const UserProfileModal = ({ user, onClose, onUpdate, onDelete }) => {
  //Estado del formulario
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  //Estado de errores
  const [errors, setErrors] = useState({});

  //Estado de edición
  const [isEditing, setIsEditing] = useState(false);

  //Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Estado para confirmar eliminación
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Efecto para cuando se edita un user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user]);

  // Función para manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (isEditing && formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "Debe ingresar su contraseña actual para cambiarla.";
      }
      if (formData.newPassword.length < 7) {
        newErrors.newPassword =
          "La nueva contraseña debe tener al menos 7 caracteres";
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Las nuevas contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await onUpdate(updateData);
      setIsEditing(false);

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      setErrors({
        ...errors,
        general: error.message || "Error al actualizar el perfil",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar la eliminación de la cuenta
  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete();
      setShowConfirmDelete(false);
    } catch (error) {
      setErrors({
        ...errors,
        general: error.message || "Error al eliminar la cuenta",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Fondo oscuro que cierra el modal al hacer clic fuera
    <div className="profile-modal-backdrop" onClick={onClose}>
      {/* Contenido del modal */}
      <div
        className="profile-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón para cerrar el modal */}
        <button className="profile-modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>Mi Perfil</h2>

        {errors.general && (
          <p className="profile-error-message">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {errors.name && (
              <span className="profile-error">{errors.name}</span>
            )}
          </div>

          <div className="profile-form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {errors.email && (
              <span className="profile-error">{errors.email}</span>
            )}
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
                {errors.currentPassword && (
                  <span className="profile-error">
                    {errors.currentPassword}
                  </span>
                )}
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
                {errors.newPassword && (
                  <span className="profile-error">{errors.newPassword}</span>
                )}
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
                  {errors.confirmNewPassword && (
                    <span className="profile-error">
                      {errors.confirmNewPassword}
                    </span>
                  )}
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
                    setIsEditing(false);

                    setFormData({
                      name: user.name,
                      email: user.email,
                      currentPassword: "",
                      newPassword: "",
                      confirmNewPassword: "",
                    });
                    setErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="profile-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </button>
                <button
                  type="button"
                  className="profile-delete-btn"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  Eliminar Cuenta
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmDelete && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal-content small-modal">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se
              puede deshacer y se eliminarán todas tus reservas.
            </p>
            <div className="profile-modal-actions">
              <button
                className="profile-cancel-btn"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                className="profile-delete-btn"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileModal;
