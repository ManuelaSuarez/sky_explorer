import { useState } from "react";
import "./ModalLogin.css";
import Validations from "../Validations/Validations.jsx";

const ModalLogin = ({ closeModal, openRegister, onSubmit, errores, refs  }) => {
    const [formData, setFormData] =
      useState({
        email: "",
        password: "",
      });
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  return (
    <div className="background" onClick={closeModal}>
      <div className="modal-card login-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-side login-left">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2>Iniciar Sesión</h2>
          <p className="description">Accede a tus viajes y experiencias personalizadas</p>

          <form action="/POST" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <i className="fa-solid fa-envelope"></i>
              <input type="email" placeholder="Correo electrónico" name="email"
                value={formData.email}
                onChange={handleChange}
                ref={refs.emailRef} 
                />
              // {errores.email && <p style={{ color: "red" }}>{errores.email}</p>}
            </div>
            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input type="password" placeholder="Contraseña" name="password"
                value={formData.password}
                onChange={handleChange}
                ref={refs.passwordRef}
                />
              {errores.password && <p style={{ color: "red" }}>{errores.password}</p>}
            </div>
          </form>
          <button className="login-button">Iniciar Sesión</button>

        </div>
        <div className="modal-side login-right">
          <div className="overlay-shape">
            <h2>¡Bienvenido a bordo!</h2>
            <p>Regístrate para reservar vuelos, guardar destinos y más</p>
            <button className="swap-button" onClick={() => openRegister("register")}>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  }
export default ModalLogin;
