import { useState } from "react";
import "./ModalRegister.css";

const ModalRegister = ({ openLogin, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  // Actualiza el estado formData con lo que escribe el user
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Si hay errores los limpia al escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  // Validaciones de nombre, email y contraseña
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    // Validar nombre
    if (!formData.name) {
      newErrors.name = "El nombre es obligatorio";
      isValid = false;
    } else if (formData.name.length > 13) {
      newErrors.name = "El nombre no puede exceder 13 caracteres";
      isValid = false;
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
      isValid = false;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
      isValid = false;
    } else if (formData.password.length < 7) {
      newErrors.password = "La contraseña debe tener al menos 7 caracteres";
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si hay errores no envía el form
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      // redirige al login si el registro es exitoso
      openLogin("login");
    } catch (error) {
      setErrors({
        ...errors,
        general: error.message,
      });
    }
  };

  return (
    <div className="background" onClick={closeModal}>
      <div
        className="modal-card register-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-side register-left">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <h2>Registrarse</h2>
          <p className="description">
            Crea tu cuenta y planifica tu próximo destino
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="input-group">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder="Correo electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
            {errors.general && (
              <p
                className="error-message
general-error"
              >
                {errors.general}
              </p>
            )}
            <button type="submit" className="register-button">
              Registrarse
            </button>
          </form>
        </div>

        <div className="modal-side register-right">
          <div className="overlay-shape">
            <h2>¿Ya tienes un vuelo reservado?</h2>
            <p>Inicia sesión y accede a todos tus itinerarios</p>
            <button className="swap-button" onClick={() => openLogin("login")}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalRegister;
