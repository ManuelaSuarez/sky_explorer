import "./ModalLogin.css";

const ModalLogin = ({ onFlip, onClose }) => {
  return (
    <div className="modal-card login-card">
      <div className="modal-side login-left">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Iniciar Sesión</h2>
        <p className="description">Accede a tus viajes y experiencias personalizadas</p>
        <div className="input-group">
          <i className="fa-solid fa-envelope"></i>
          <input type="email" placeholder="Correo electrónico" />
        </div>
        <div className="input-group">
          <i className="fa-solid fa-lock"></i>
          <input type="password" placeholder="Contraseña" />
        </div>
        <button className="login-button">Iniciar Sesión</button>
      </div>
      <div className="modal-side login-right">
        <div className="overlay-shape">
          <h2>¡Bienvenido a bordo!</h2>
          <p>Regístrate para reservar vuelos, guardar destinos y más</p>
          <button className="swap-button" onClick={onFlip}>
            Registrarse
          </button>


        </div>
      </div>
    </div>
  );
};

export default ModalLogin;
