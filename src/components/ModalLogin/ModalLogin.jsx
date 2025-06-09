import { useState, useRef } from "react";
import "./ModalLogin.css";

const ModalLogin = ({ closeModal, openRegister, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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

  // Validaciones de email y contraseña
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", general: "" };

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
      setIsSubmitting(true);
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      // Obtener el token como texto
      const token = await response.text();
      console.log("Token recibido:", token);

      // Guardar el token en localStorage
      localStorage.setItem("token", token);

      // Cerrar el modal y notificar al padre
      closeModal();

      if (onSubmit) {
        onSubmit({ success: true, token });
      }
    } catch (error) {
      console.error("Error de login:", error);

      setErrors({
        ...errors,
        general: error.message || "Error al iniciar sesión",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="background" onClick={closeModal}>
      <div
        className="modal-card login-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-side login-left">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <h2>Iniciar Sesión</h2>
          <p className="description">
            Accede a tus viajes y experiencias personalizadas
          </p>
          // Formulario de login
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder="Correo electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                ref={emailRef}
              />
              // Si hay errores en el email los muestra
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
                ref={passwordRef}
              />
              // Si hay errores en el password los muestra
              {errors.password && (
                <p className="error-message">{errors.password}</p>
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
            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
        // Mensaje a la derecha para que el user se registre
        <div className="modal-side login-right">
          <div className="overlay-shape">
            <h2>¡Bienvenido a bordo!</h2>
            <p>Regístrate para reservar vuelos, guardar destinos y más</p>
            <button
              className="swap-button"
              onClick={() => openRegister("register")}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalLogin;
